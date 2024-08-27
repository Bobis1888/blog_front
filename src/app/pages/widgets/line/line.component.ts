import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {
  ContentService,
  Filter,
  ListResponse,
  RequestType,
  Search,
  Status
} from "src/app/core/service/content/content.service";
import {Observable, retry, takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";
import {CoreModule} from "src/app/core/core.module";
import {Content} from "app/core/service/content/content";
import {LineType} from "app/core/service/line/line.service";
import {UserInfo} from "app/core/service/auth/user-info";
import {AuthService, AuthState} from "app/core/service/auth/auth.service";
import {EditPreviewDialog} from "app/pages/content/edit-preview-dialog/edit-preview-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialog} from "app/pages/content/delete-dialog/delete.dialog";
import {ChangeStatusDialog} from "app/pages/content/change-status-dialog/change-status.dialog";
import {ActivatedRoute} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatSelect} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

export enum Period {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  all = 'all',
}

@Component({
  selector: 'line',
  standalone: true,
  imports: [CoreModule, MatSelect, ReactiveFormsModule],
  animations: animations,
  templateUrl: './line.component.html',
  styleUrl: './line.component.less',
})
export class LineComponent extends UnSubscriber implements OnInit {

  protected state: 'loading' | 'data' | 'empty' = 'loading';
  public items: Array<Content> = [];
  protected type: LineType = LineType.top;
  protected totalPages: number = 0;
  protected info: UserInfo = {} as UserInfo;
  protected sortBy: Array<string> = [];
  protected direction: 'ASC' | 'DESC' = 'DESC';
  protected max: number = 10;
  protected page: number = 0;
  protected selectedPeriod: Period = Period.all;

  protected readonly LineType = LineType;
  protected readonly Status = Status;
  protected loadMoreProgress: boolean = false;

  @ViewChild('end')
  protected endDiv!: ElementRef;

  constructor(
    private contentService: ContentService,
    protected authService: AuthService,
    protected dialog: MatDialog,
    protected router: ActivatedRoute,
    protected deviceService: DeviceDetectorService
  ) {
    super();
  }

  get canLoadMore(): boolean {
    return this.totalPages > 1 && !this.loadMoreProgress && this.page < this.totalPages - 1;
  }

  get periods(): Array<Period> {
    return [
      Period.day,
      Period.week,
      Period.month,
      Period.year,
      Period.all
    ];
  }

  ngOnInit(): void {

    if (this.authService.authState == AuthState.authorized) {
      this.authService.info()
        .pipe(takeUntil(this.unSubscriber)).subscribe({
        next: it => this.info = it
      });
    }

    this.router.data.subscribe({
      next: (it) => {
        this.type = it["type"];
        this.init();
      },
      error: () => this.state = 'empty'
    });

    let savedPeriod = sessionStorage.getItem('selectedPeriod');

    if (savedPeriod) {
      this.selectedPeriod = savedPeriod as Period;
    }
  }

  protected get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  public editPreview(id: string, content: string) {
    this.state = 'loading';
    this.dialog.open(EditPreviewDialog, {
      data: {id: id, content: content},
      autoFocus: false
    }).afterClosed().pipe(
      takeUntil(this.unSubscriber),
    ).subscribe({
      next: (it) => {
        if (it) {
          this.init();
        } else {
          this.state = 'data';
        }
      }
    });
  }

  public delete(id: string) {
    this.state = 'loading';
    this.dialog.open(DeleteDialog, {
      data: {id}
    }).afterClosed()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it) => it ? this.init() : this.state = 'data'
      });
  }

  changeStatus(id: string, status: Status) {
    this.state = 'loading';
    this.dialog.open(ChangeStatusDialog, {
      data: {status: status, id: id}
    }).afterClosed().pipe(
      takeUntil(this.unSubscriber),
    ).subscribe({
      next: (it) => {

        if (it) {
          this.init();
        } else {
          this.state = 'data';
        }
      }
    });
  }

  removeFromBookmarks(id: string) {
    this.state = 'loading';
    this.contentService.removeFromBookmarks(id)
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: () => this.init()
    });
  }

  public loadMore() {
    this.loadMoreProgress = true;
    this.page++;
    this.init(false);
  }

  private init(withClear: boolean = true) {

    if (!this.loadMoreProgress) {
      this.state = 'loading';
    }

    this.list()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {

          if (withClear) {
            this.items = [];
          }

          this.items.push(...it.list);
          this.totalPages = it.totalPages ?? 0;
          this.state = this.items.length > 0 ? 'data' : 'empty';
          this.loadMoreProgress = false;
        },
        error: () => this.state = 'empty'
      });
  }

  private list(): Observable<ListResponse> {
    return this.contentService.list(this.filter);
  }

  private get filter(): Filter {
    let requestType: RequestType;

    switch (this.type) {
      case 'top':
        requestType = RequestType.TOP;
        break;

      case 'bookmarks':
        requestType = RequestType.BOOKMARK;
        break;

      case 'subscriptions':
        requestType = RequestType.SUBSCRIPTION;
        break;

      case 'my':
        requestType = RequestType.MY;
        break;

      default:
        requestType = RequestType.TOP;
    }

    return {
      max: this.max,
      page: this.page,
      sortBy: this.sortBy,
      direction: this.direction,
      type: requestType,
      search: this.search()
    } as Filter;
  }

  private search(): Search {
    const datePipe = new DatePipe('en');
    const today = new Date();
    let subtractDays = 0;

    switch (this.selectedPeriod) {
      case Period.day:
        subtractDays = 1;
        break;
      case Period.week:
        subtractDays = 7;
        break;
      case Period.month:
        subtractDays = 30;
        break;
      case Period.year:
        subtractDays = 365;
        break;
      case Period.all:
        return {} as Search;
    }

    let startDate = new Date().setDate(today.getDate() - subtractDays);

    return {
      endDate: datePipe.transform(today, 'yyyy-MM-dd'),
      startDate: datePipe.transform(startDate, 'yyyy-MM-dd')
    } as Search;
  }

  @HostListener('document:scroll', ['$event'])
  public onViewportScroll() {
    const windowHeight = window.innerHeight;

    if (!this.endDiv) {
      return;
    }

    const boundingRectEnd = this.endDiv.nativeElement.getBoundingClientRect();

    if (boundingRectEnd.top >= 0 && boundingRectEnd.bottom <= windowHeight && this.canLoadMore) {
      this.loadMore();
    }
  }

  public reorder() {
    this.direction = this.direction == 'ASC' ? 'DESC' : 'ASC';

    this.reload();
  }

  public reload(force: boolean = false) {
    sessionStorage.setItem('selectedPeriod', this.selectedPeriod);

    if (this.items.length > 0 || force) {
      this.state = 'loading';
      this.page = 0;
      this.init();
    }
  }
}
