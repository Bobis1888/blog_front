import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {EventType, Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {takeUntil} from "rxjs";
import {MatDrawer} from "@angular/material/sidenav";

@Component({template: ''})
export abstract class ScrollToTop extends UnSubscriber implements AfterViewInit {

  private rt: Router;
  private dd: DeviceDetectorService;
  @ViewChild('drawer') public drawer?: MatDrawer;

  protected constructor() {
    super();
    this.rt = inject(Router);
    this.dd = inject(DeviceDetectorService);
  }

  ngAfterViewInit(): void {

    if (!this.dd.isMobile()) {
      return;
    }

    this.rt.events
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it) => {

          if (it.type == EventType.NavigationStart) {
            this.drawer?.close().then();
          }

          if (it.type == EventType.NavigationEnd || it.type == EventType.NavigationSkipped) {
            this.scrollToElement(document.getElementById('top'), 'auto');
          }
        }
      });
  }

  scrollToElement($element: any, behavior: string = 'smooth'): void {
    $element?.scrollIntoView({
      behavior: behavior,
      block: 'start',
      inline: 'nearest',
    });
  }
}
