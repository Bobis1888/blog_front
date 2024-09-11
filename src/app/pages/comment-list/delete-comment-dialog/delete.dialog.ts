import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {HasErrors} from "app/core/abstract/has-errors";
import {CoreModule} from "app/core/core.module";
import {catchError, of, takeUntil} from "rxjs";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {CommentService} from "app/core/service/comment/comment.service";

export interface DialogData {
  id: number;
}

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete.dialog.html',
  styleUrl: './delete.dialog.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, MatButton, TranslateModule],
})
export class DeleteDialog extends HasErrors {

  constructor(
    private dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    private contentService: CommentService) {
    super();
  }

  submit(): void {
    this.contentService
      .delete(this.data.id)
      .pipe(
        takeUntil(this.unSubscriber),
        catchError((err) => of(err))
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false)
      });
  }

  close() {
    this.dialogRef.close();
  }
}
