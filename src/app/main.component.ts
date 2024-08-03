import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute,
  ChildrenOutletContexts, EventType,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';
import {MenuComponent} from "src/app/pages/menu/menu.component";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {mergeMap, takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";
import {NgIf} from "@angular/common";
import {RightWidgetComponent} from "app/pages/widgets/right/right-widget.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "app/core/service/auth/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatRipple} from "@angular/material/core";
import {MatBadge} from "@angular/material/badge";
import {ThemeDataService} from "app/core/service/theme-data.service";
import {MatDivider} from "@angular/material/divider";
import {FooterWidgetComponent} from "app/pages/widgets/footer/footer-widget.component";
import {ScrollToTop} from "app/core/abstract/scroll-to-top";

@Component({
  selector: 'app-root',
  standalone: true,
  animations: animations,
  imports: [RouterOutlet, MenuComponent, NgIf, RightWidgetComponent, MatToolbar, MatIcon, MatIconButton, RouterLink, MatDrawerContainer, MatDrawer, MatButton, MatDrawerContent, TranslateModule, MatSidenav, MatRipple, MatBadge, MatDivider, FooterWidgetComponent, MatSidenavModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
})
export class MainComponent extends ScrollToTop implements OnInit {

  // todo config
  private languages: Array<string> = ['ru', 'en'];
  private ref: MatSnackBarRef<any> | null = null;

  constructor(protected aRouter: ActivatedRoute,
              protected router: Router,
              protected authService: AuthService,
              protected outletContexts: ChildrenOutletContexts,
              protected themeDataService: ThemeDataService,
              protected deviceDetectorService: DeviceDetectorService,
              protected matSnackBar: MatSnackBar) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }

  get hideTopMenu(): boolean {
    return this.router.url.includes('/landing') || this.router.url.includes('/update-process');
  }

  ngOnInit(): void {
    this.themeDataService.init();

    this.authService.getState().pipe(
      mergeMap((it: { 'logged': boolean }) => this.authService.info(it.logged))
    ).subscribe();
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
