import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'src/app/core/core.module';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'public-info',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './public-info-widget.component.html',
  styleUrl: './public-info-widget.component.less',
})
export class PublicInfoWidgetComponent implements OnInit {

  protected state: 'data' | 'loading' = 'loading';

  constructor(
    private deviceService: DeviceDetectorService) {
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
  }
}
