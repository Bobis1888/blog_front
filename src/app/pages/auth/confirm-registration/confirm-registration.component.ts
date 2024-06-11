import {Component} from '@angular/core';
import {CoreModule} from "app/core/core.module";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'confirm-registration',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './confirm-registration.component.html',
  styleUrl: './confirm-registration.component.less'
})
export class ConfirmRegistrationComponent {
  constructor(protected deviceService: DeviceDetectorService) {}

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }
}
