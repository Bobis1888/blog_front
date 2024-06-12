import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendsComponent} from "app/pages/trends/trends.component";
import {TopicsComponent} from "app/pages/topics/topics.component";
import {AuthService} from "app/core/service/auth/auth.service";
import {animations} from "app/core/config/app.animations";

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
    private deviceService: DeviceDetectorService,
  ) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {}
}
