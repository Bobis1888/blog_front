import {Component, inject, Input, OnInit} from '@angular/core';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {DeviceDetectorService} from 'ngx-device-detector';
import {animations} from 'app/core/config/app.animations';
import {CommentService} from "app/core/service/comment/comment.service";
import {Comment, CommentList} from "app/core/service/comment/comment";
import {takeUntil} from "rxjs";
import {CoreModule} from "app/core/core.module";

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [CoreModule],
  animations: animations,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.less',
})
export class CommentListComponent extends UnSubscriber implements OnInit {

  @Input({required: true})
  contentId!: string;
  protected deviceService: DeviceDetectorService;
  protected commentService: CommentService;
  protected max = 10;
  protected page = 0;
  protected totalPages: number = 0;
  protected loadMoreProgress: boolean = false;
  protected items: Array<Comment> = [];
  protected state: 'loading' | 'data' | 'empty' = 'loading';

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get canLoadMore(): boolean {
    return this.totalPages > 1 && !this.loadMoreProgress && this.page < this.totalPages - 1;
  }

  constructor() {
    super();
    this.commentService = inject(CommentService);
    this.deviceService = inject(DeviceDetectorService);
  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.commentService.list({
      contentId: this.contentId,
      max: this.max,
      page: this.page
    })
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it: CommentList) => {

          if (it?.list) {
            this.items.push(...it.list);
          }

          this.state = this.items.length > 0 ? 'data' : 'empty';
          this.totalPages = it?.totalPages;
        },
        error: () => this.state = 'empty'
      });
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.page++;
    this.list();
  }
}
