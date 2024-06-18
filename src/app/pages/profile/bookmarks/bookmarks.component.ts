import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {CoreModule} from "src/app/core/core.module";
import {HasErrors} from "src/app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {ContentService, Filter} from "src/app/core/service/content/content.service";
import {UserInfo} from "src/app/core/service/auth/user-info";
import {Article} from "app/core/service/content/article";

@Component({
  selector: 'bookmarks',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.less'
})
export class BookmarksComponent extends HasErrors implements OnInit {

  constructor(private contentService: ContentService,
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

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.formGroup.addControl('search', new FormControl(''));

    this.state = 'load';
    this.contentService.bookmarks(
      {
        max: this.max,
        page: this.page,
        sortBy: this.sortBy,
      } as Filter
    )
      .pipe(
        takeUntil(this.unSubscriber),
      )
      .subscribe({
        next: it => {
          this.list = it;

          if (it.length === 0) {
            this.state = 'empty';
          } else {
            this.state = 'data';
          }
        },
        error: () => this.state = 'empty'
      });
  }

  remove(id: string) {
    this.contentService.removeFromBookmarks(id)
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: () => {
        this.list = this.list.filter(it => it.id !== id);

        if (this.list.length === 0) {
          this.state = 'empty';
        }
      }
    });
  }
}
