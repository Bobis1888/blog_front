import {Component} from '@angular/core';
import {ContentService} from "src/app/core/service/content/content.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {ClipboardService} from "ngx-clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "app/core/service/auth/auth.service";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MaterialModule} from "app/theme/material/material.module";
import {
  CommonModule,
} from "@angular/common";
import {SafeHtmlPipe} from "app/core/pipe/safe-html";
import {Meta} from "@angular/platform-browser";
import {SubscriptionService} from "app/core/service/content/subscription.service";
import {ViewContentComponent} from "app/pages/content/view/view-content.component";
import {delay, takeUntil} from "rxjs";

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
  ],
  templateUrl: './view-by-link-content.component.html',
  styleUrl: './view-by-link-content.component.less'
})
export class ViewByLinkContentComponent extends ViewContentComponent {

  private link: string = '';

  constructor(contentService: ContentService,
              deviceService: DeviceDetectorService,
              matSnackBar: MatSnackBar,
              meta: Meta,
              subsService: SubscriptionService,
              authService: AuthService,
              clipboardService: ClipboardService,
              aRouter: ActivatedRoute) {
    super(contentService,
      deviceService,
      matSnackBar,
      meta,
      subsService,
      authService,
      clipboardService,
      aRouter);
  }

  override ngOnInit() {

    this.aRouter.params
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(params => {
        if (params['link'] != this.link) {
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
