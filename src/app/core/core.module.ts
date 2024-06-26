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
        // background: '#e8e1d5',
        background: '#585653'
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
    ContentService
  ]
})
export class CoreModule {}
