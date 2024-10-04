import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MaterialModule} from "app/theme/material/material.module";
import {
  CommonModule,
} from "@angular/common";
import {SafeHtmlPipe} from "app/core/pipe/safe-html";
import {ViewContentComponent} from "app/pages/content/view/view-content.component";
import {delay, takeUntil} from "rxjs";
import {CommentListComponent} from "app/pages/comment-list/comment-list.component";

@Component({
  selector: 'view-by-link-content',
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
  templateUrl: '../view/view-content.component.html',
  styleUrl: '../view/view-content.component.less'
})
export class ViewByLinkContentComponent extends ViewContentComponent {

  private link: string = '';

  override ngOnInit() {

    this.aRouter.params
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(params => {
        if (params['link'] != this.link) {
          this.link = params['link'];
          this.init(params['link']);
        }
      });
  }

  override init(link: string) {
    this.state = 'loading';
    this.contentService.getByLink(link)
      .pipe(
        takeUntil(this.unSubscriber),
        delay(300),
      )
      .subscribe({
        next: it => {
          this.content = it;
          this.state = 'data';
          this.id = it.id;

          if (this.content.title) {
            this.title.setTitle('Mylog - ' + this.content.title);
          }

          if (this.content.tags) {
            this.meta.updateTag({
              name: 'keywords', content: this.content.tags
                .map((it) => it.replace('#', '')).join(' ')
            });
          }

          this.loadAuthorInfo();
        },
        error: () => this.state = 'empty'
      });
  }
}
