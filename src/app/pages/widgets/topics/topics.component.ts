import {Component, OnInit} from '@angular/core';
import {CoreModule} from 'src/app/core/core.module';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ContentService, Filter, TagsFilter} from "src/app/core/service/content/content.service";
import {takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";

@Component({
  selector: 'topics',
  standalone: true,
  animations: animations,
  imports: [CoreModule],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.less',
})
export class TopicsComponent extends UnSubscriber implements OnInit {

  protected state: 'data' | 'loading' = 'loading';

  constructor(
    private contentService: ContentService,
    private deviceService: DeviceDetectorService,
  ) {
    super();
  }

  public topics: Array<string> = [];

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.contentService.tags({
      max: 10,
      page: 0
    } as TagsFilter)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {

          it.forEach((it) => {

            if (it.includes(',')) {
              this.topics.push(...it.split(','));
            } else {
              this.topics.push(it);
            }
          });

          this.state = 'data';
        },
        error: err => {
          this.state = 'data';
        }
      });
  }
}
