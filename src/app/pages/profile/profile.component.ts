import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {CoreModule} from "app/core/core.module";
import {RouterOutlet} from "@angular/router";
import {LeftMenuComponent} from "app/pages/profile/left-menu/left-menu.component";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CoreModule, RouterOutlet, LeftMenuComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent implements OnInit {

  constructor(
    protected deviceService: DeviceDetectorService) {
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {}
}
