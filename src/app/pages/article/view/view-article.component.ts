import {Component, OnInit} from '@angular/core';
import {Article, ContentService, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {takeUntil} from "rxjs";
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

@Component({
  selector: 'view-article',
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
  templateUrl: './view-article.component.html',
  styleUrl: './view-article.component.less'
})
export class ViewArticleComponent extends UnSubscriber implements OnInit {

  protected content: Article = {} as Article;
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  private ref: MatSnackBarRef<any> | null = null;

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private router: Router,
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

    this.contentService.get(id)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.content = it;
          this.state = 'data';

          if (this.content.title) {
            this.title.setTitle(this.content.title);
          }

          if (this.content.preView) {
            this.meta.updateTag({name: 'description', content: this.content.preView});
          }

          if (this.content.tags) {
            this.meta.updateTag({name: 'keywords', content: this.content.tags
                .map((it) => it.replace('#', '')).join(' ')});
          }
        },
        error: err => {
          this.state = 'empty';
        }
      });
  }

  public goToUser(userName: string): void {

    if (!userName) {
      return;
    }

    this.router.navigate(['/search'], {queryParams: {q: userName, author: true}}).then();
  }

  share() {

    if (this.isMobile) {
      //TODO if mobile
    }

    this.clipboardService.copy(location.href);
    this.ref = this.matSnackBar.open(
      this.translate.instant('viewArticlePage.sharedSuccess'),
      undefined,
      {duration: 3000, panelClass: 'snack-bar'});
  }

  like() {
    this.content.isLiked = !this.content.isLiked;
    this.contentService.like(this.content.id)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe();
  }

  bookmark() {
    this.content.isFavorite = !this.content.isFavorite;
    this.contentService.saveToBookmark(this.content.id)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.ref?.dismiss();
  }

  protected readonly Status = Status;
}
