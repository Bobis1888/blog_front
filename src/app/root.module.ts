import {CommonModule} from "@angular/common";
import {NgModule, OnDestroy} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
import {TrendsComponent} from "app/pages/trends/trends.component";
import {TopicsComponent} from "app/pages/topics/topics.component";
import {NgxEditorModule} from "ngx-editor";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";

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
export class RootModule implements OnDestroy {

  private languages: Array<string> = ['ru', 'en'];
  private ref: MatSnackBarRef<any> | null = null;

  constructor(protected translate: TranslateService,
              protected aRouter: ActivatedRoute,
              protected router: Router,
              protected matSnackBar: MatSnackBar) {

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
      router.navigate(['/auth/confirm-registration']).then();
      return;
    }

    if (aRouter.snapshot.queryParamMap.get("reset-password-result") === "true") {
      router.navigate(['/auth/change-password'], {queryParams: {uuid: aRouter.snapshot.queryParamMap.get("uuid")}}).then();
      return;
    }

    if (aRouter.snapshot.queryParamMap.get("expired") === "true") {
      setTimeout(() => {
        this.ref = this.matSnackBar.open(
          this.translate.instant('errors.sessionExpired'),
          undefined,
          {duration: 5000, panelClass: 'snack-bar'});
      }, 500)
    }
  }

  ngOnDestroy(): void {
    this.ref?.dismiss();
  }
}
