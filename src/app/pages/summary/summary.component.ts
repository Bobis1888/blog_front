import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CoreModule} from 'app/core/core.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendsComponent} from "app/pages/trends/trends.component";
import {TopicsComponent} from "app/pages/topics/topics.component";
import {AuthService} from "app/core/service/auth/auth.service";
import {animations} from "app/core/config/app.animations";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'summary',
  standalone: true,
  animations: animations,
  imports: [CoreModule, FormsModule, TrendsComponent, TopicsComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.less',
})
export class SummaryComponent extends UnSubscriber implements OnInit {
  constructor(
    protected authService: AuthService,
    private tittle: Title,
    private translate: TranslateService,
    private deviceService: DeviceDetectorService,
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.tittle.setTitle(this.translate.instant('summaryPage.title'));
    }, 300);

  }


}
