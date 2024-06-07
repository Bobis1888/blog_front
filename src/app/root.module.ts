import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
import {TrendsComponent} from "app/pages/trends/trends.component";
import {TopicsComponent} from "app/pages/topics/topics.component";
import {NgxEditorModule} from "ngx-editor";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    RouterOutlet,
    NgxEditorModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    TranslateModule,
    NgxEditorModule,
  ],
  providers: [
    HttpSenderService,
    AuthService,
    ContentService
  ]
})
export class RootModule {

  private languages: Array<string> = ['ru', 'en'];

  constructor(translate: TranslateService, aRouter: ActivatedRoute, router: Router ) {

    if (localStorage.getItem('currentLanguage') != null) {
      translate.setDefaultLang(localStorage.getItem('currentLanguage') ?? 'en');
    } else {
      let browserLang = translate.getBrowserLang();

      if (browserLang && this.languages.includes(browserLang)) {
        translate.setDefaultLang(browserLang);
      } else {
        translate.setDefaultLang('ru');
      }
    }

    //todo handle service
    if (aRouter.snapshot.queryParamMap.get("confirm-email-result") === "true") {
      router.navigate(['/auth/confirm-registration']);
      return;
    }

    if (aRouter.snapshot.queryParamMap.get("reset-password-result") === "true") {
      router.navigate(['/auth/change-password'], {queryParams: {uuid: aRouter.snapshot.queryParamMap.get("uuid")}});
      return;
    }
  }
}
