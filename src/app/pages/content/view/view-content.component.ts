import {Component, OnInit} from '@angular/core';
import {ContentService, Filter, ListResponse, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {delay, Observable, takeUntil} from "rxjs";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {DeviceDetectorService} from "ngx-device-detector";
import {ClipboardService} from "ngx-clipboard";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "app/core/service/auth/auth.service";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MaterialModule} from "app/theme/material/material.module";
import {
  CommonModule,
} from "@angular/common";
import {SafeHtmlPipe} from "app/core/pipe/safe-html";
import {Meta} from "@angular/platform-browser";
import {Content, Reaction} from "app/core/service/content/content";
import {SubscriptionService} from "app/core/service/content/subscription.service";
import {animations} from "app/core/config/app.animations";

@Component({
  selector: 'view-content',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    TranslateModule,
    MaterialModule,
    RouterLink,
    SafeHtmlPipe,
    CommonModule,
  ],
  animations: animations,
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.less'
})
export class ViewContentComponent extends UnSubscriber implements OnInit {

  protected content: Content = {} as Content;
  protected authorContents: Array<Content> = [];
  protected tagContents: Array<Content> = [];
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  private ref: MatSnackBarRef<any> | null = null;
  protected readonly Status = Status;
  private id: string = '';

  constructor(protected contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              protected matSnackBar: MatSnackBar,
              protected meta: Meta,
              protected subsService: SubscriptionService,
              protected authService: AuthService,
              protected clipboardService: ClipboardService,
              protected router: Router,
              protected aRouter: ActivatedRoute) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get favoriteReaction(): Reaction {
    return this.content.reactions.find(it => it.value === 'favorite') ?? {} as Reaction;
  }

  get reactions(): Array<Reaction> {
    return this.content.reactions.filter(it => it.value != 'favorite' && it.value != 'favorite_outline') ?? []
  }

  ngOnInit(): void {

    this.aRouter.params
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(params => {

        if (params['id'] != this.id) {
          this.id = params['id'];
          this.init(params['id']);
        }
      });
  }

  share() {

    if (this.isMobile) {
      navigator.share({
        title: this.content.title,
        text: this.translate.instant('viewContentPage.shareText'),
        url: location.href
      }).then();
      return;
    }

    this.clipboardService.copy(location.href);
    this.ref = this.matSnackBar.open(
      this.translate.instant('viewContentPage.sharedSuccess'),
      undefined,
      {duration: 3000, panelClass: 'snack-bar'});
  }

  react(value: string = 'favorite') {
    let obs: Observable<any>;

    if (this.content.reactions.find(it => it.value === value)?.isUserReaction) {
      obs = this.contentService.removeReact(this.content.id);
    } else {
      obs = this.contentService.react(this.content.id, value);
    }

    obs.pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => {

          if (!this.content.reactions.find(it => it.value == value)) {
            this.content.reactions.push({
              value: value,
              count: 0,
              isUserReaction: false
            });
          }

          this.content.reactions.map(it => {

            if (it.value === value) {
              it.count = it.isUserReaction ? it.count - 1 : it.count + 1;
              it.isUserReaction = !it.isUserReaction;
            } else {
              if (it.isUserReaction) {
                it.count = it.count - 1;
                it.isUserReaction = false;
              }
            }
          });

          this.content.reactions = this.content.reactions.filter(it => it.count > 0);
        }
      });
  }

  bookmark() {
    let obs: Observable<any>;

    if (this.content.isSaved) {
      obs = this.contentService.removeFromBookmarks(this.content.id);
    } else {
      obs = this.contentService.saveToBookmarks(this.content.id);
    }

    obs.pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => {
          this.ref?.dismiss();
          this.content.isSaved = !this.content.isSaved;
          let message = this.translate.instant(`viewContentPage.${this.content.isSaved ? 'addedToBookmarks' : 'removedFromBookmarks'}`);
          this.ref = this.matSnackBar.open(message, undefined, {duration: 3000, panelClass: 'snack-bar'});
        }
      });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.ref?.dismiss();
  }

  init(id: string) {
    this.state = 'loading';
    this.contentService.get(id)
      .pipe(
        takeUntil(this.unSubscriber),
        delay(300),
      )
      .subscribe({
        next: it => {
          this.content = it;
          this.state = 'data';

          if (this.content.title) {
            this.title.setTitle('Mylog - ' + this.content.title);
          }

          if (this.content.tags) {
            this.meta.updateTag({
              name: 'keywords', content: this.content.tags
                .map((it) => it.replace('#', '')).join(' ')
            });
          }

          this.listByParams(this.content.authorName)
            .pipe(takeUntil(this.unSubscriber))
            .subscribe({
              next: (it) => this.authorContents = it?.list ?? []
            });
          this.listByParams('', this.content.tags)
            .pipe(takeUntil(this.unSubscriber))
            .subscribe({
              next: (it) => this.tagContents = it?.list ?? []
            });
        },
        error: () => this.state = 'empty'
      });
  }

  unsubscribe() {
    this.subsService.unsubscribe(this.content.authorName)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (res) => {

          if (res.success) {
            this.content.actions.canUnsubscribe = false;
            this.content.actions.canSubscribe = true;
          }
        }
      });
  }

  subscribe() {
    this.subsService.subscribe(this.content.authorName)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (res) => {

          if (res.success) {
            this.content.actions.canUnsubscribe = true;
            this.content.actions.canSubscribe = false;
          }
        }
      });
  }

  listByParams(author: string = '', tags: string[] = []): Observable<ListResponse> {
    return this.contentService.list({
      max: 3,
      page: 0,
      search: {
        author: author,
        tags: tags
      },
      sortBy: ['countViews', 'date']
    } as Filter);
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
