import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {AuthService} from 'app/core/service/auth/auth.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ThemeDataService} from "app/core/service/theme-data.service";
import {animations} from 'app/core/config/app.animations';
import {UserInfo} from 'app/core/service/auth/user-info';
import {map, of} from "rxjs";
import {isMarkActive} from "ngx-editor/helpers";

@Component({
  selector: 'top-menu',
  standalone: true,
  animations: animations,
  imports: [CoreModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected themeDataService: ThemeDataService,
    protected deviceService: DeviceDetectorService,
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get hasImage(): boolean {
    return this.authService.userInfo.hasImage ?? false;
  }

  set hasImage(value: boolean) {
    let info: UserInfo | null = this.authService.userInfo;

    if (info != null) {
      info.hasImage = value;
      this.authService.userInfo = info;
    }
  }

  ngOnInit(): void {
    this.themeDataService.init();
    this.authService.getState()
      .pipe(
        map((it) => it.logged ? this.authService.info() : of({}))
      ).subscribe();
  }

  get hideSearchButton(): boolean {
    return this.router.url.includes('/search');
  }

  protected readonly isMarkActive = isMarkActive;
}
