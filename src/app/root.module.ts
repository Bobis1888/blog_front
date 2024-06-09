import {AsyncPipe, CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
import {NgxEditorModule} from "ngx-editor";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ClipboardModule} from "ngx-clipboard";
import {MaskitoDirective} from "@maskito/angular";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    RouterOutlet,
    ClipboardModule,
    AsyncPipe,
    NgxEditorModule,
    MaskitoDirective,
    NgxSkeletonLoaderModule.forRoot({
      count: 3,
      theme: {
        extendsFromRoot: true,
        background: '#e8e1d5',
      }
    }),
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterLink,
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
export class RootModule {}
