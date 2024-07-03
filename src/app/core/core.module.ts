import {AsyncPipe, CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "src/app/theme/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "src/app/core/service/auth/auth.service";
import {HttpSenderService} from "src/app/core/service/base/http-sender.service";
import {TranslateModule} from "@ngx-translate/core";
import {ContentService} from "src/app/core/service/content/content.service";
import {NgxEditorModule} from "ngx-editor";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ClipboardModule} from "ngx-clipboard";
import {MaskitoDirective} from "@maskito/angular";
import {SafeHtmlPipe} from "src/app/core/pipe/safe-html";
import {ThemeDataService} from "app/core/service/theme-data.service";
import {SubscriptionService} from "app/core/service/content/subscription.service";
import {StatisticsService} from "app/core/service/content/statistics.service";
import {StorageService} from "app/core/service/content/storage.service";

@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    RouterLink,
    RouterOutlet,
    ClipboardModule,
    AsyncPipe,
    NgxEditorModule,
    MaskitoDirective,
    SafeHtmlPipe,
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
    NgxEditorModule,
    NgxSkeletonLoaderModule,
    ClipboardModule,
    AsyncPipe,
    MaskitoDirective
  ],
  providers: [
    HttpSenderService,
    AuthService,
    ContentService,
    SubscriptionService,
    StatisticsService,
    ThemeDataService,
    StorageService
  ]
})
export class CoreModule {}
