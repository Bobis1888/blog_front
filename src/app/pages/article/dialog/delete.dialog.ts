import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {HasErrors} from "src/app/core/abstract/has-errors";
import {CoreModule} from "src/app/core/core.module";
import {ContentService} from "app/core/service/content/content.service";
import {takeUntil} from "rxjs";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

export interface DialogData {
  id: string;
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
    private contentService: ContentService) {
    super();
  }

  submit(): void {
    this.contentService
      .delete(this.data.id)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => this.dialogRef.close(true)
      });
  }

  close() {
    this.dialogRef.close();
  }
}
