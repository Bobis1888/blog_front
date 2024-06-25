import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContentService, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Observable, takeUntil} from "rxjs";
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
import {animations} from "app/core/config/app.animations";
import {Meta} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialog} from "../delete-dialog/delete.dialog";
import {Content} from "app/core/service/content/content";
import {ChangeStatusDialog} from "../change-status-dialog/change-status.dialog";

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
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  private ref: MatSnackBarRef<any> | null = null;
  protected readonly Status = Status;
  @ViewChild("top")
  protected topElement: ElementRef | null = null;

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private router: Router,
              private matSnackBar: MatSnackBar,
              private meta: Meta,
              protected authService: AuthService,
              protected matDialog: MatDialog,
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
      .pipe(takeUntil(this.unSubscriber))
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

          // TODO fix it
          setTimeout(() => {
            this.topElement?.nativeElement?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
          });
        },
        error: err => {
          this.state = 'empty';
        }
      });
  }
}
