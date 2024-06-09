import {CommonModule} from "@angular/common";
import {NgModule, OnDestroy} from "@angular/core";
import {MaterialModule} from "app/theme/material/material.module";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ContentService} from "app/core/service/content/content.service";
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
// TODO refactor
export class RootModule implements OnDestroy {

  // todo config
  private languages: Array<string> = ['ru', 'en'];
  private ref: MatSnackBarRef<any> | null = null;

  constructor(protected translate: TranslateService,
              protected aRouter: ActivatedRoute,
              protected router: Router,
              protected matSnackBar: MatSnackBar) {

    // TODO do in bootstrap
    if (localStorage.getItem('currentLanguage') != null && localStorage.getItem('currentLanguage') != this.translate.getDefaultLang()) {
      this.translate.setDefaultLang(localStorage.getItem('currentLanguage') ?? 'en');
    } else {
      let browserLang = this.translate.getBrowserLang();

      if (browserLang && this.languages.includes(browserLang)) {
        this.translate.setDefaultLang(browserLang);
      } else {
        this.translate.setDefaultLang('ru');
      }
    }

    this.translate.onDefaultLangChange.subscribe(() => {
      this.ref?.dismiss();
      this.firstLaunch();
    });

    //todo handle service
    if (this.aRouter.snapshot.queryParamMap.get("confirm-email-result") === "true") {
      this.router.navigate(['/auth/confirm-registration']).then();
      return;
    }

    if (this.aRouter.snapshot.queryParamMap.get("reset-password-result") === "true") {
      this.router.navigate(['/auth/change-password'], {queryParams: {uuid: this.aRouter.snapshot.queryParamMap.get("uuid")}}).then();
      return;
    }

    if (this.aRouter.snapshot.queryParamMap.get("expired") === "true") {
      setTimeout(() => {
        this.ref = this.matSnackBar.open(
          this.translate.instant('errors.sessionExpired'),
          undefined,
          {duration: 5000, panelClass: 'snack-bar'});
      }, 500)
    }

    this.firstLaunch();
  }

  ngOnDestroy(): void {
    this.ref?.dismiss();
  }

  private firstLaunch(): void {
    if (localStorage.getItem('firstLaunch') == null) {
      setTimeout(() => {
        this.ref = this.matSnackBar.open(
          this.translate.instant('firstLaunchTitle'),
          this.translate.instant('firstLaunchAction'),
          {panelClass: 'snack-bar'});
        this.ref?.onAction()
          .subscribe({
            next: value => localStorage.setItem('firstLaunch', 'false')
          });
      }, 500);

    }
  }
}
