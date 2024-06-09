import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
import {NgxEditorModule} from "ngx-editor";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    RouterOutlet,
    NgxEditorModule,
    NgxSkeletonLoaderModule.forRoot({
      count: 3,
      theme: {
        extendsFromRoot: true,
        background: '#b2a9a0',
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
  ],
  providers: [
    HttpSenderService,
    AuthService,
    ContentService
  ]
})
export class RootModule {}
