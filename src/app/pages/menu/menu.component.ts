import { Component, OnInit } from '@angular/core';
import { CoreModule } from 'app/core/core.module';
import { UnSubscriber } from 'app/core/abstract/un-subscriber';
import { AuthService } from 'app/core/service/auth/auth.service';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {DeviceDetectorService} from "ngx-device-detector";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [CoreModule, NgOptimizedImage],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {
  public currentLanguage: string = 'en';

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected deviceService: DeviceDetectorService
  ) {
    super();
  }

  get hideSearchButton() : boolean {
    return this.router.url.includes('/search');
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
      .subscribe(() => {
        this.router.navigate(['/']).then();
        return;
      });
  }

  changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    this.translate.setDefaultLang(this.currentLanguage);
  }
}
