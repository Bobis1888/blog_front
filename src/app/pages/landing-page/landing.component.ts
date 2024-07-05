import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {DeviceDetectorService} from 'ngx-device-detector';
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {Router} from "@angular/router";
import {ThemeDataService} from "app/core/service/theme-data.service";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.less',
})
export class LandingComponent extends UnSubscriber implements OnInit {
  constructor(
    private deviceService: DeviceDetectorService,
    protected themeDataService: ThemeDataService,
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    localStorage.setItem('firstLaunch', 'true');
    this.title.setTitle(this.translate.instant('landingPage.metaTitle'));
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
