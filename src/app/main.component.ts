import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ChildrenOutletContexts, Router, RouterOutlet} from '@angular/router';
import {MenuComponent} from "src/app/pages/menu/menu.component";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {skip, takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";

@Component({
  selector: 'app-root',
  standalone: true,
  animations: animations,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: 'main.component.html',
})
export class MainComponent extends UnSubscriber implements OnInit {

  // todo config
  private languages: Array<string> = ['ru', 'en'];
  private ref: MatSnackBarRef<any> | null = null;

  constructor(protected translate: TranslateService,
              protected aRouter: ActivatedRoute,
              protected router: Router,
              protected outletContexts: ChildrenOutletContexts,
              protected matSnackBar: MatSnackBar) {
    super();
  }

  ngOnInit(): void {

    // TODO do in bootstrap
    if (localStorage.getItem('currentLanguage') == null) {
      let browserLang = this.translate.getBrowserLang() ?? '';

      if (!this.languages.includes(browserLang)) {
        browserLang = 'ru';
      }

      this.translate.setDefaultLang(browserLang);
      localStorage.setItem('currentLanguage', browserLang);
    }

    this.translate.onDefaultLangChange
      .pipe(skip(1))
      .subscribe(() => {
        this.ref?.dismiss();
        this.firstLaunch();
      });

    //todo handle service
    this.aRouter.queryParams
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it) => {

          if (it["confirm-email-result"] === "true") {
            this.router.navigate(['/auth/confirm-registration']).then();
            return;
          }

          if (it["reset-password"]) {
            this.router.navigate(['/auth/change-password'], {queryParams: {uuid: it["reset-password"]}}).then();
            return;
          }

          if (it["expired"] === "true") {
            setTimeout(() => {
              this.ref = this.matSnackBar.open(
                this.translate.instant('errors.sessionExpired'),
                undefined,
                {duration: 5000, panelClass: 'snack-bar'});
            }, 500)
          }
        }
      });

    this.firstLaunch();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
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

  getRouteAnimationData() {
    return this.outletContexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
