import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from "app/root.module";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'summary',
  standalone: true,
  imports: [RootModule, FormsModule, ReactiveFormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.less'
})
export class SummaryComponent extends UnSubscriber implements OnInit {
  constructor(private router: Router, private deviceService: DeviceDetectorService) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {

  }
}
