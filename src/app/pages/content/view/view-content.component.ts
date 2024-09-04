import {Component, inject, OnInit} from '@angular/core';
import {ContentService, Filter, RequestType, Status,} from 'app/core/service/content/content.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {delay, map, Observable, takeUntil} from 'rxjs';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ClipboardService} from 'ngx-clipboard';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from 'app/core/service/auth/auth.service';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MaterialModule} from 'app/theme/material/material.module';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from 'app/core/pipe/safe-html';
import {Meta} from '@angular/platform-browser';
import {Content, Reaction} from 'app/core/service/content/content';
import {SubscriptionService} from 'app/core/service/content/subscription.service';
import {animations} from 'app/core/config/app.animations';
import {MatDialog} from "@angular/material/dialog";
import {ReportDialog} from "app/pages/content/report-dialog/report-dialog.component";
import {CommentListComponent} from "app/pages/comment-list/comment-list.component";
import {Actions} from "app/core/service/content/actions";

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
    CommentListComponent,
  ],
  animations: animations,
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.less',
})
export class ViewContentComponent extends UnSubscriber implements OnInit {

  protected contentService: ContentService;
  protected deviceService: DeviceDetectorService;
  protected matSnackBar: MatSnackBar;
  protected meta: Meta;
  protected dialog: MatDialog;
  protected subsService: SubscriptionService;
  protected authService: AuthService;
  protected clipboardService: ClipboardService;
  protected router: Router;
  protected aRouter: ActivatedRoute;

  protected content: Content = {} as Content;
  protected additionalContent: Array<Content> = [];
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  private ref: MatSnackBarRef<any> | null = null;
  protected readonly Status = Status;
  protected id: string = '';
  protected timeToRead = 0;

  get availableReactions() {
    return ['favorite', 'local_fire_department', 'mood', 'mood_bad', 'thumb_up', 'thumb_down', 'star'];
  }

  constructor() {
    super();
    this.contentService = inject(ContentService);
    this.deviceService = inject(DeviceDetectorService);
    this.matSnackBar = inject(MatSnackBar);
    this.meta = inject(Meta);
    this.dialog = inject(MatDialog);
    this.subsService = inject(SubscriptionService);
    this.authService = inject(AuthService);
    this.clipboardService = inject(ClipboardService);
    this.router = inject(Router);
    this.aRouter = inject(ActivatedRoute);
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get favoriteReaction(): Reaction {
    return (
      this.content.reactions.find((it) => it.value === 'favorite') ??
      ({} as Reaction)
    );
  }

  get reactions(): Array<Reaction> {
    return (
      this.content.reactions.filter(
        (it) => it.value != 'favorite' && it.value != 'favorite_outline',
      ) ?? []
    );
  }

  ngOnInit(): void {
    this.aRouter.params
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((params) => {
        if (params['id'] != this.id) {
          this.id = params['id'];
          this.init(params['id']);
        }
      });
  }

  share() {
    if (this.isMobile) {
      navigator
        .share({
          title: this.content.title,
          text: this.translate.instant('viewContentPage.shareText'),
          url: location.href,
        })
        .then();
      return;
    }

    this.clipboardService.copy(location.href);
    this.ref = this.matSnackBar.open(
      this.translate.instant('viewContentPage.sharedSuccess'),
      undefined,
      {duration: 3000, panelClass: 'snack-bar'},
    );
  }

  react(value: string = 'favorite') {
    let obs: Observable<any>;

    if (
      this.content.reactions.find((it) => it.value === value)?.isUserReaction
    ) {
      obs = this.contentService.removeReact(this.content.id);
    } else {
      obs = this.contentService.react(this.content.id, value);
    }

    obs.pipe(takeUntil(this.unSubscriber)).subscribe({
      next: () => {
        if (!this.content.reactions.find((it) => it.value == value)) {
          this.content.reactions.push({
            value: value,
            count: 0,
            isUserReaction: false,
          });
        }

        this.content.reactions.map((it) => {
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

        this.content.reactions = this.content.reactions.filter(
          (it) => it.count > 0,
        );
      },
    });
  }

  bookmark() {
    let obs: Observable<any>;

    if (this.content.isSaved) {
      obs = this.contentService.removeFromBookmarks(this.content.id);
    } else {
      obs = this.contentService.saveToBookmarks(this.content.id);
    }

    obs.pipe(takeUntil(this.unSubscriber)).subscribe({
      next: () => {
        this.ref?.dismiss();
        this.content.isSaved = !this.content.isSaved;
        let message = this.translate.instant(
          `viewContentPage.${this.content.isSaved ? 'addedToBookmarks' : 'removedFromBookmarks'}`,
        );
        this.ref = this.matSnackBar.open(message, undefined, {
          duration: 3000,
          panelClass: 'snack-bar',
        });
      },
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.ref?.dismiss();
  }

  init(id: string) {
    this.state = 'loading';
    this.contentService
      .get(id)
      .pipe(takeUntil(this.unSubscriber), delay(300))
      .subscribe({
        next: (it) => {
          this.content = it;
          this.state = 'data';

          if (this.content.title) {
            this.title.setTitle('Mylog - ' + this.content.title);
          }

          if (this.content.tags) {
            this.meta.updateTag({
              name: 'keywords',
              content: this.content.tags
                .map((it) => it.replace('#', ''))
                .join(' '),
            });
          }

          if (!this.content.actions) {
            this.content.actions = {} as Actions
          }

          if (this.content.tags?.length > 0) {
            this.listAdditionalContent()
              .pipe(takeUntil(this.unSubscriber))
              .subscribe({
                next: (it) => (this.additionalContent = it ?? []),
              });
          }

          if (this.content) {
            this.calculateTimeToRead();
          }
        },
        error: () => (this.state = 'empty'),
      });
  }

  subscribe() {
    this.subsService
      .subscribe(this.content.authorName)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.content.actions.canUnsubscribe = true;
            this.content.actions.canSubscribe = false;
          }
        },
      });
  }

  listAdditionalContent(): Observable<Array<Content>> {
    return this.contentService.list({
      max: 3,
      page: 0,
      type: RequestType.SEARCH,
      search: {
        query: this.content.tags?.join(','),
        exclude: [this.content.id]
      },
      sortBy: ['publishedDate', 'countViews'],
    } as Filter).pipe(
      map(it => it?.list ?? []),
    );
  }

  calculateTimeToRead(): void {
    const wordCount = this.content.content.split(' ').length
    this.timeToRead = Math.ceil(wordCount / 200);
  }

  report(): void {
    this.dialog.open(ReportDialog, {
      data: {id: this.content.id}
    })
      .afterClosed()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
      next: (it) => it ? this.content.actions.canReport = false : null
    });
  }
}
