import {Component} from '@angular/core';
import {RootModule} from "src/app/root.module";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'confirm-registration',
  standalone: true,
  imports: [RootModule],
  templateUrl: './confirm-registration.component.html',
  styleUrl: './confirm-registration.component.less'
})
export class ConfirmRegistrationComponent {
  constructor(protected deviceService: DeviceDetectorService) {}

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }
}
