import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    RouterOutlet,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    TranslateModule
  ],
  providers: [
    AuthService,
    HttpSenderService
  ]
})
export class RootModule {
  constructor(translate: TranslateService) {

    if (translate.getDefaultLang() === undefined) {
      translate.setDefaultLang('ru');
    }
  }
}
