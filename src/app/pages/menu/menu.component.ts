import { Component, OnInit } from '@angular/core';
import { RootModule } from 'app/root.module';
import { UnSubscriber } from 'app/abstract/un-subscriber';
import { AuthService } from 'app/core/service/auth/auth.service';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [RootModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {
  public currentLanguage: string = 'en';

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected translate: TranslateService,
    protected deviceService: DeviceDetectorService
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.currentLanguage = this.translate.getDefaultLang();
  }

  logout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((it) => {
        this.router.navigate(['/']);
        return;
      });
  }

  changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    this.translate.setDefaultLang(this.currentLanguage);
    localStorage.setItem('currentLanguage', this.currentLanguage);
  }
}
