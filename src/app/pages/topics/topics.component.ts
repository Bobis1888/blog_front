import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from 'app/root.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ContentService, Filter} from "app/core/service/content/content.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'topics',
  standalone: true,
  imports: [RootModule],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.less',
})
export class TopicsComponent extends UnSubscriber implements OnInit {

  protected state: 'data' | 'loading' = 'loading';

  constructor(
    private router: Router,
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
    } as Filter)
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

  public goToTopic(topic: string): void {

    if (!topic) {
      return;
    }

    topic = topic.replace('#', '');

    this.router.navigate(['/search'], {queryParams: {q: topic, tag: true}});
  }
}
