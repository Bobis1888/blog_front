import {AsyncPipe, CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ClipboardModule} from "ngx-clipboard";
import {MaskitoDirective} from "@maskito/angular";
import {SafeHtmlPipe} from "app/core/pipe/safe-html";
import {ThemeDataService} from "app/core/service/theme-data.service";
import {SubscriptionService} from "app/core/service/content/subscription.service";
import {StatisticsService} from "app/core/service/content/statistics.service";
import {StorageService} from "app/core/service/content/storage.service";
import {DragAndDropDirective} from "app/core/directive/drag-and-drop";
import {StoriesService} from "app/core/service/stories/stories.service";
import {TagService} from "app/core/service/content/tag.service";
import {ReportService} from "app/core/service/report.service";
import {NotificationService} from "app/core/service/notification/notification.service";

@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    RouterLink,
    RouterOutlet,
    ClipboardModule,
    AsyncPipe,
    MaskitoDirective,
    SafeHtmlPipe,
    DragAndDropDirective,
    NgxSkeletonLoaderModule.forRoot({
      count: 3,
      theme: {
        extendsFromRoot: true,
        background: 'var(--skeleton-bg-color)',
      }
    }),
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    SafeHtmlPipe,
    TranslateModule,
    NgxSkeletonLoaderModule,
    ClipboardModule,
    AsyncPipe,
    MaskitoDirective,
    DragAndDropDirective
  ],
  providers: [
    HttpSenderService,
    AuthService,
    ContentService,
    SubscriptionService,
    StatisticsService,
    ThemeDataService,
    StorageService,
    StoriesService,
    NotificationService,
    TagService,
    ReportService
  ]
})
export class CoreModule {}
