import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ChildrenOutletContexts, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MenuComponent} from "src/app/pages/menu/menu.component";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";
import {NgIf} from "@angular/common";
import {RightWidgetComponent} from "app/pages/widgets/right/right-widget.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav} from "@angular/material/sidenav";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "app/core/service/auth/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-root',
  standalone: true,
  animations: animations,
  imports: [RouterOutlet, MenuComponent, NgIf, RightWidgetComponent, MatToolbar, MatIcon, MatIconButton, RouterLink, MatDrawerContainer, MatDrawer, MatButton, MatDrawerContent, TranslateModule, MatSidenav, MatRipple],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
})
export class MainComponent extends UnSubscriber implements OnInit {

  // todo config
  private languages: Array<string> = ['ru', 'en'];
  private ref: MatSnackBarRef<any> | null = null;

  constructor(protected aRouter: ActivatedRoute,
              protected router: Router,
              protected authService: AuthService,
              protected outletContexts: ChildrenOutletContexts,
              protected deviceDetectorService: DeviceDetectorService,
              protected matSnackBar: MatSnackBar) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }

  get hideTopMenu(): boolean {
    return this.router.url.includes('/landing');
  }

  ngOnInit(): void {
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
            this.router.navigate([], {
              queryParams: {},
              queryParamsHandling: '',
            }).then();
            setTimeout(() => {
              this.ref = this.matSnackBar.open(
                this.translate.instant('errors.sessionExpired'),
                undefined,
                {duration: 5000, panelClass: 'snack-bar'});
            }, 500)
          }
        }
      });

    // TODO do in bootstrap
    if (localStorage.getItem('currentLanguage') == null) {
      let browserLang = this.translate.getBrowserLang() ?? '';

      if (!this.languages.includes(browserLang)) {
        browserLang = 'en';
      }

      this.translate.setDefaultLang(browserLang);
    }

    this.firstLaunch();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.ref?.dismiss();
  }

  private firstLaunch(): void {

    if (localStorage.getItem('firstLaunch') == null) {
      this.router.navigate(['landing']).then(() => localStorage.setItem('firstLaunch', 'true'));
      return;
    }

    if (localStorage.getItem('cookie') == null) {
      setTimeout(() => {

        if (this.router.url.includes('landing')) {
          return;
        }

        this.ref = this.matSnackBar.open(
          this.translate.instant('firstLaunchTitle'),
          this.translate.instant('firstLaunchAction'),
          {panelClass: 'snack-bar', verticalPosition: 'bottom'});
        this.ref?.onAction()
          .subscribe({
            next: value => localStorage.setItem('cookie', 'true')
          });
      }, 500);
    }
  }

  getRouteAnimationData() {
    return this.outletContexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
