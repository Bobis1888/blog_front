import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {MatButton} from "@angular/material/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'profile-left-menu',
  standalone: true,
  imports: [MatButton, NgIf, RouterLink, TranslateModule, MatCard, NgClass, NgForOf],
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.less'
})
export class LeftMenuComponent implements OnInit {

  constructor(
    protected deviceService: DeviceDetectorService,
    protected translate: TranslateService) {
  }

  protected menu: Array<string> = [];

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.menu = Object.keys(this.translate.instant("profilePage.menu"));
  }
}
