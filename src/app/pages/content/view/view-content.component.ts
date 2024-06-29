import {Component, OnInit} from '@angular/core';
import {ContentService, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
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
import {Content} from "app/core/service/content/content";

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
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.less'
})
export class ViewContentComponent extends UnSubscriber implements OnInit {

  protected content: Content = {} as Content;
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  private ref: MatSnackBarRef<any> | null = null;
  protected readonly Status = Status;

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private matSnackBar: MatSnackBar,
              private meta: Meta,
              protected authService: AuthService,
              private clipboardService: ClipboardService,
              private aRouter: ActivatedRoute) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    let id = this.aRouter.snapshot.params['id'];

    if (id == null) {
      this.state = 'empty';
      return;
    }

    this.init(id);
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

  like() {
    let obs: Observable<any>;

    if (this.content.isLiked) {
      obs = this.contentService.dislike(this.content.id);
    } else {
      obs = this.contentService.like(this.content.id);
    }

    obs.pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => {
          this.content.isLiked = !this.content.isLiked;

          if (this.content.isLiked) {
            this.content.likes++;
          } else {
            this.content.likes--;
          }
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
        },
        error: () => this.state = 'empty'
      });
  }
}
