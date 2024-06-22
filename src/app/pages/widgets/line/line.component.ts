import {Component, OnInit} from '@angular/core';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {ContentService, Filter, ListResponse, Search, Status} from "src/app/core/service/content/content.service";
import {Observable, of, takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";
import {CoreModule} from "src/app/core/core.module";
import {Article} from "app/core/service/content/article";
import {LineType} from "app/core/service/line/line.service";
import {UserInfo} from "app/core/service/auth/user-info";
import {AuthService} from "app/core/service/auth/auth.service";
import {EditPreviewDialog} from "app/pages/article/edit-preview-dialog/edit-preview-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialog} from "app/pages/article/delete-dialog/delete.dialog";
import {ChangeStatusDialog} from "app/pages/article/change-status-dialog/change-status.dialog";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'line',
  standalone: true,
  imports: [CoreModule],
  animations: animations,
  templateUrl: './line.component.html',
  styleUrl: './line.component.less',
})
export class LineComponent extends UnSubscriber implements OnInit {

  protected state: 'loading' | 'data' | 'empty' = 'loading';
  public items: Array<Article> = [];
  protected type: LineType = LineType.top;
  protected totalPages: number = 0;
  protected info: UserInfo = {} as UserInfo;
  protected sortBy: Array<string> = [];
  protected max: number = 10;
  protected page: number = 0;

  protected readonly LineType = LineType;
  protected readonly Status = Status;

  constructor(
    private contentService: ContentService,
    protected authService: AuthService,
    protected dialog: MatDialog,
    protected router: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.info()
      .pipe(takeUntil(this.unSubscriber)).subscribe({
      next: it => this.info = it
    });

    this.router.data.subscribe({
      next: (it) => {
        this.type = it["type"];
        this.init();
      },
      error: () => this.state = 'empty'
    });
  }

  public editPreview(id: string, content: string) {
    this.state = 'loading';
    this.dialog.open(EditPreviewDialog, {
      data: {id: id, content: content}
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
    this.contentService.removeFromBookmarks(id)
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: () => {
        this.items = this.items.filter(it => it.id !== id);

        if (this.list.length === 0) {
          this.state = 'empty';
        }
      }
    });
  }

  private init() {
    this.state = 'loading';
    this.list()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.items = it.list;
          this.totalPages = it.totalPages;
          this.state = this.items.length > 0 ? 'data' : 'empty';
        },
        error: () => this.state = 'empty'
      });
  }

  private list(): Observable<ListResponse> {
    switch (this.type) {
      case 'top': {
        return this.contentService.getTrends();
      }
      case 'my': {
        return this.contentService.all(this.filter);
      }
      case 'bookmarks': {
        return this.contentService.bookmarks(this.filter);
      }
      case 'subscriptions': {
        //TODO
        return of({list: new Array<Article>()} as ListResponse);
      }
      default: {
        return of({list: new Array<Article>()} as ListResponse);
      }
    }
  }

  private get filter(): Filter {
    return {
      max: this.max,
      page: this.page,
      sortBy: this.sortBy,
      search: {
        author: this.info.nickname
      } as Search
    } as Filter;
  }
}
