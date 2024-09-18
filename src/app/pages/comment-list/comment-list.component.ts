import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {animations} from 'app/core/config/app.animations';
import {CommentService} from "app/core/service/comment/comment.service";
import {Comment, CommentList} from "app/core/service/comment/comment";
import {takeUntil} from "rxjs";
import {CoreModule} from "app/core/core.module";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HasErrors} from "app/core/abstract/has-errors";
import {SafeHtmlService} from "app/core/pipe/safe-html";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialog} from "app/pages/comment-list/delete-comment-dialog/delete.dialog";
import {AuthService} from "app/core/service/auth/auth.service";

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [CoreModule, FormsModule, ReactiveFormsModule],
  animations: animations,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.less',
})
export class CommentListComponent extends HasErrors implements OnInit {

  @Input({required: true})
  contentId!: string;

  @ViewChild('focusField')
  protected focusField?: ElementRef<HTMLTextAreaElement>;

  protected deviceService: DeviceDetectorService;
  protected commentService: CommentService;
  protected authService: AuthService;
  private safeHtmlService: SafeHtmlService;
  private matDialog: MatDialog;

  protected max = 10;
  protected page = 0;
  protected totalPages: number = 0;
  protected totalRows: number = 0;
  protected loadMoreProgress: boolean = false;
  protected items: Array<Comment> = [];
  protected state: 'loading' | 'data' | 'empty' = 'loading';
  protected maxLength: number = 255;
  protected direction: 'ASC' | 'DESC' = 'ASC';

  protected parent?: Comment | null;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get canLoadMore(): boolean {
    return this.totalPages > 1 && !this.loadMoreProgress && this.page < this.totalPages - 1;
  }

  get contentLength(): number {
    return this.formGroup.get('content')?.value?.length || 0;
  }

  constructor() {
    super();
    this.commentService = inject(CommentService);
    this.deviceService = inject(DeviceDetectorService);
    this.safeHtmlService = inject(SafeHtmlService);
    this.matDialog = inject(MatDialog);
    this.authService = inject(AuthService);
  }

  ngOnInit(): void {
    this.formGroup.addControl("content", new FormControl(""));
    const direction = localStorage.getItem("commentDirection");

    if (direction == 'ASC' || direction == 'DESC') {
      this.direction = direction;
    }

    this.list();
  }

  list(add: boolean = false) {
    this.commentService.list({
      contentId: this.contentId,
      max: this.max,
      page: this.page,
      direction: this.direction
    })
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it: CommentList) => {

          if (it?.list) {

            if (!add) {
              this.items = [];
            }

            this.items.push(...it.list);
          }

          this.state = this.items.length > 0 ? 'data' : 'empty';
          this.loadMoreProgress = false;
          this.totalPages = it?.totalPages ?? 0;
          this.totalRows = it?.totalRows ?? 0;
        },
        error: () => this.state = 'empty'
      });
  }

  textareaFocus() {
    this.focusField?.nativeElement.focus();
  }

  submit() {
    this.state = 'loading';
    let comment = this.safeHtmlService.sanitize(this.formGroup.get('content')?.value);
    this.page = 0;

    comment = this.replaceLinksWithHtmlTags(comment);

    this.commentService
      .save(this.contentId, comment, this.parent?.id)
      .subscribe({
        next: (it) => {
          if (it.success) {
            this.parent = null;
            this.list();
            this.formGroup.get('content')?.setValue('');
          }
        },
        error: () => this.state = this.items.length > 0 ? 'data' : 'empty'
      });
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.page++;
    this.list(true);
  }

  reorder() {
    this.direction = this.direction == 'ASC' ? 'DESC' : 'ASC';
    localStorage.setItem('commentDirection', this.direction);

    if (this.items.length > 0) {
      this.state = 'loading';
      this.page = 0;
      this.list();
    }
  }

  delete(comment: Comment) {
    this.state = 'loading';
    this.page = 0;
    this.matDialog.open(DeleteDialog, {
      data: {
        "id": comment.id
      }
    })
      .afterClosed()
      .subscribe({
        next: (it) => {

          if (it) {
            this.list();
          }

          this.state = this.items.length > 0 ? 'data' : 'empty'
        },
        error: () => this.state = this.items.length > 0 ? 'data' : 'empty'
      });
  }

  reply(it: Comment) {
    this.parent = it;
    this.formGroup.get('content')?.setValue('');
    this.scrollToElement(this.focusField?.nativeElement);
    setTimeout(() => this.textareaFocus(), 300);
  }

  scrollToElement($element: any): void {
    $element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }

  cancel() {
    this.parent = null;
    this.formGroup.get('content')?.setValue('');
  }


  private replaceLinksWithHtmlTags(text: string): string {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    return text.replace(urlRegex, (match) => {
      return `<a href="${match}">${match}</a>`;
    });
  }
}
