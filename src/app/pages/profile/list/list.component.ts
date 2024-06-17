import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "src/app/core/core.module";
import {HasErrors} from "src/app/core/abstract/has-errors";
import {mergeMap, takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Article, ContentService, Filter, Search, Status} from "src/app/core/service/content/content.service";
import {AuthService} from "src/app/core/service/auth/auth.service";
import {UserInfo} from "src/app/core/service/auth/user-info";
import {DeleteDialog} from "app/pages/article/dialog/delete.dialog";

@Component({
  selector: 'user-article-list',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.less'
})
export class ListComponent extends HasErrors implements OnInit {

  constructor(private contentService: ContentService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService) {
    super();
  }

  protected state: 'data' | 'load' | 'empty' = 'load';
  protected list: Array<Article> = [];
  protected info: UserInfo = {} as UserInfo;
  protected sortBy: Array<string> = [];
  protected max: number = 10;
  protected page: number = 0;
  private ref: MatSnackBarRef<any> | null = null;
  protected readonly Status = Status;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.formGroup.addControl('search', new FormControl(''));
    this.init();
  }

  delete(id: string) {
    this.dialog.open(DeleteDialog, {
      data: {id}
    }).afterClosed()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => this.init()
      });
  }

  changeStatus(id: string, published: Status) {
    this.contentService.changeStatus(id, published).pipe(
      takeUntil(this.unSubscriber),
    ).subscribe({
      next: () => this.init()
    });
  }

  private init() {
    this.state = 'load';
    this.authService.info()
      .pipe(
        takeUntil(this.unSubscriber),
        mergeMap(val => {
          this.info = val;
          return this.contentService.list({
            max: this.max,
            page: this.page,
            sortBy: this.sortBy,
            search: {
              author: this.info.nickname
            } as Search
          } as Filter)
        })
      )
      .subscribe({
        next: it => {
          this.list = it;

          if (this.list.length === 0) {
            this.state = 'empty';
          } else {
            this.state = 'data';
          }
        },
        error: () => this.state = 'load'
      });
  }
}
