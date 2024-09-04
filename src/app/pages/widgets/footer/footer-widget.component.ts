import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './footer-widget.component.html',
  styleUrl: './footer-widget.component.less',
})
export class FooterWidgetComponent implements OnInit {

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
