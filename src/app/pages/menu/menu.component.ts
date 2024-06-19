import { Component } from '@angular/core';
import { CoreModule } from 'app/core/core.module';
import { UnSubscriber } from 'app/core/abstract/un-subscriber';
import { AuthService } from 'app/core/service/auth/auth.service';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber {
  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected deviceService: DeviceDetectorService
  ) {
    super();
  }

  get hideSearchButton(): boolean {
    return this.router.url.includes('/search') || !this.authService.isAuthorized;
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  logout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(() => {
        this.router.navigate(['/']).then();
        return;
      });
  }
}
