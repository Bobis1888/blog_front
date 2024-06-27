import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {AuthService} from 'app/core/service/auth/auth.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {

  protected isDarkMode: boolean = true;

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected deviceService: DeviceDetectorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isDarkMode = document.body.getAttribute("data-theme") == "dark";
    let storageValue: string | null = localStorage.getItem('data-theme');

    // TODO enable for mobile
    if (!this.isMobile) {

      if (storageValue == null && !this.isSystemDark() && this.isDarkMode ||
        storageValue == null && this.isSystemDark() && !this.isDarkMode ||
        storageValue == 'dark' && !this.isDarkMode ||
        storageValue == 'light' && this.isDarkMode) {
        this.switchMode();
      }
    }
  }

  get hideSearchButton(): boolean {
    return this.router.url.includes('/search');
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  switchMode(): void {
    this.isDarkMode = !this.isDarkMode;

    document.body.setAttribute(
      'data-theme',
      this.isDarkMode ? 'dark' : 'light',
    );

    localStorage.setItem('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  isSystemDark(): boolean {
    return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches;
  }
}
