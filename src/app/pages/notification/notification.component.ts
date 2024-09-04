import {Component, inject, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {animations} from 'app/core/config/app.animations';
import {takeUntil} from "rxjs";
import {CoreModule} from "app/core/core.module";
import {HasErrors} from "app/core/abstract/has-errors";
import {AuthService} from "app/core/service/auth/auth.service";
import {Notification, NotificationList, NotificationService} from "app/core/service/notification/notification.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router} from "@angular/router";

@Component({
  selector: 'notification',
  standalone: true,
  imports: [CoreModule, MatExpansionModule],
  animations: animations,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.less',
})
export class NotificationComponent extends HasErrors implements OnInit {

  protected authService: AuthService;
  protected deviceService: DeviceDetectorService;
  protected notificationService: NotificationService;
  protected router: Router;

  protected max = 10;
  protected page = 0;
  protected totalPages: number = 0;
  protected loadMoreProgress: boolean = false;
  protected items: Array<Notification> = [];
  protected state: 'loading' | 'data' | 'empty' = 'loading';
  protected unreadCount = 0;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get canLoadMore(): boolean {
    return this.totalPages > 1 && !this.loadMoreProgress && this.page < this.totalPages - 1;
  }

  constructor() {
    super();
    this.deviceService = inject(DeviceDetectorService);
    this.authService = inject(AuthService);
    this.notificationService = inject(NotificationService);
    this.router = inject(Router);
  }

  ngOnInit(): void {
    this.notificationService.countUnread()
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: (it) => this.unreadCount = it ?? 0
    });

    this.list();
  }

  list(add: boolean = false) {
    this.notificationService.list(
      this.max,
      this.page,
    )
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it: NotificationList) => {

          if (it?.list) {

            if (!add) {
              this.items = [];
            }

            this.items.push(...it.list);
          }

          this.state = this.items.length > 0 ? 'data' : 'empty';
          this.loadMoreProgress = false;
          this.totalPages = it?.totalPages ?? 0;
        },
        error: () => this.state = 'empty'
      });
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.page++;
    this.list(true);
  }

  read(notification: Notification) {

    if (notification.isRead) {
      return;
    }

    this.notificationService.read(notification.id)
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: () => {
        notification.isRead = true;
        AuthService.infoChanged.next(true);
      }
    });
  }

  readAll() {

    if (this.unreadCount == 0) {
      return;
    }

    this.notificationService.readAll()
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: () => {
        AuthService.infoChanged.next(true);
        this.list();
      }
    });
  }

  processLinks(e: any) {
    const element: HTMLElement = e.target;
    if (element.nodeName === 'A') {
      e.preventDefault();
      let link = element.getAttribute('href');

      if (!link) {
        link = element.getAttribute("routerLink")
      }


      if (link) {
        this.router.navigate([link]).then();
      }
    }
  }
}
