import {Component, OnInit} from '@angular/core';
import {Article, ContentService, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {takeUntil} from "rxjs";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {DeviceDetectorService} from "ngx-device-detector";
import {ClipboardService} from "ngx-clipboard";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "app/core/service/auth/auth.service";

@Component({
  selector: 'view-article',
  standalone: true,
  imports: [RootModule],
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
              private translate: TranslateService,
              private matSnackBar: MatSnackBar,
              protected authService: AuthService,
              private clipboardService: ClipboardService,
              private aRouter: ActivatedRoute) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    let  id = this.aRouter.snapshot.params['id'];

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

  public goToSearch(topic: string): void {

    if (!topic) {
      return;
    }

    topic = topic.replace('#', '');

    this.router.navigate(['/search'], {queryParams: {q: topic, tag: true}}).then();
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
