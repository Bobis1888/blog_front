import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {AuthService} from 'app/core/service/auth/auth.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ThemeDataService} from "app/core/service/theme-data.service";
import {animations} from 'app/core/config/app.animations';
import {UserInfo} from 'app/core/service/auth/user-info';
import {mergeMap, of, takeUntil} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "app/pages/auth/login/login.component";
import {NotificationService} from "app/core/service/notification/notification.service";

@Component({
  selector: 'top-menu',
  standalone: true,
  animations: animations,
  imports: [CoreModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {

  protected info?: UserInfo;
  protected countUnread: number = 0;

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected themeDataService: ThemeDataService,
    private notificationService: NotificationService,
    protected deviceService: DeviceDetectorService,
    private dialog: MatDialog
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.themeDataService.init();
    this.authService.getState()
      .pipe(
        takeUntil(this.unSubscriber),
        mergeMap((it) => it.logged ? this.authService.info() : of({} as UserInfo))
      ).subscribe({
      next: (it) => this.info = it
    });

    AuthService.infoChanged
      .pipe(
        takeUntil(this.unSubscriber),
        mergeMap(() => this.notificationService.countUnread()),
      )
      .subscribe({
      next: (it) => {
        this.info = this.authService.userInfo;
        this.countUnread = it ?? 0;
      }
    })
  }

  get hideSearchButton(): boolean {
    return this.router.url.includes('/search');
  }

  openLogin() {

    if (this.isMobile) {
      this.router.navigate(['auth', 'login']).then();
      return;
    }

    this.dialog.open(LoginComponent, {});
  }
}
