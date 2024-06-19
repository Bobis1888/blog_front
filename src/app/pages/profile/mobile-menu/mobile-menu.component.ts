import {Component} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {MatButton} from "@angular/material/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatCard} from "@angular/material/card";
import {LeftMenuComponent} from "app/pages/profile/left-menu/left-menu.component";

@Component({
  selector: 'profile-mobile-menu',
  standalone: true,
  imports: [MatButton, NgIf, RouterLink, TranslateModule, MatCard, NgClass, NgForOf],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.less'
})
export class MobileMenuComponent extends LeftMenuComponent {

  constructor(
    deviceService: DeviceDetectorService,
    translate: TranslateService) {
    super(deviceService, translate);
  }
}
