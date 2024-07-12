import {Component, OnInit} from '@angular/core';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {animations} from "src/app/core/config/app.animations";
import {CoreModule} from "src/app/core/core.module";
import {ActivatedRoute} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {StoriesService, Story} from "app/core/service/stories/stories.service";
import {interval, takeUntil} from "rxjs";

@Component({
  selector: 'stories',
  standalone: true,
  imports: [CoreModule],
  animations: animations,
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.less',
})
export class StoriesComponent extends UnSubscriber implements OnInit {

  protected state: 'data' | 'empty' = 'empty';
  public items: Array<Story> = [];
  protected progressbarValue = 0;
  protected currentSecond: number = 0;

  constructor(
    protected storiesService: StoriesService,
    protected router: ActivatedRoute,
    protected deviceService: DeviceDetectorService
  ) {
    super();
  }

  protected get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  protected get currentStory(): Story {
    let index = this.items.findIndex(it => it.id === this.storiesService.current);

    if (index < 0) {
      index = 0;
    }

    return this.items[index];
  }

  ngOnInit(): void {
    this.storiesService.list()
      .pipe(
        takeUntil(this.unSubscriber),
      )
      .subscribe({
        next: it => {
          this.items = it;
          this.state = this.items.length > 0 ? 'data' : 'empty';

          if (this.state == 'data' && this.items.length > 1) {
            this.startTimer(100);
          }
        },
        error: () => this.state = 'empty'
      });

  }

  startTimer(seconds: number) {
    const timer$ = interval(seconds);

    const subs = timer$.subscribe({
      next: (sec) => {
        this.progressbarValue = 100 - sec * 100 / seconds;
        this.currentSecond = sec;

        if (this.currentSecond === seconds) {
          this.nextStory();
          subs.unsubscribe();
        }
      }
    });
  }

  protected nextStory() {
    let currId = this.storiesService.current;
    let index = this.items.findIndex(it => it.id === currId);
    index = (index + 1);

    if (index >= this.items.length) {
      index = 0;
    }

    this.storiesService.current = this.items[index].id;
    this.startTimer(100);
  }
}
