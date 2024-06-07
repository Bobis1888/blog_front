import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from 'app/root.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {FormsModule} from '@angular/forms';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendsComponent} from "app/pages/trends/trends.component";
import {TopicsComponent} from "app/pages/topics/topics.component";
import {AuthService} from "app/core/service/auth/auth.service";

@Component({
  selector: 'summary',
  standalone: true,
  imports: [RootModule, FormsModule, TrendsComponent, TopicsComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.less',
})
export class SummaryComponent extends UnSubscriber implements OnInit {
  constructor(
    private router: Router,
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
