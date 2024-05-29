import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ArticleService} from "app/core/service/article/article.service";

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
    TranslateModule,
  ],
  providers: [
    HttpSenderService,
    AuthService,
    ArticleService
  ]
})
export class RootModule {
  constructor(translate: TranslateService, aRouter: ActivatedRoute, router: Router ) {
//TODO browser language
    if (localStorage.getItem('currentLanguage') != null) {
      translate.setDefaultLang(localStorage.getItem('currentLanguage') ?? 'ru');
    } else {
      translate.setDefaultLang('ru');
    }

    //todo handle service
    if (aRouter.snapshot.queryParamMap.get("confirm-email-result") === "true") {
      router.navigate(['/confirm-registration']);
      return;
    }

    if (aRouter.snapshot.queryParamMap.get("reset-password-result") === "true") {
      router.navigate(['/change-password'], {queryParams: {uuid: aRouter.snapshot.queryParamMap.get("uuid")}});
      return;
    }
  }
}
