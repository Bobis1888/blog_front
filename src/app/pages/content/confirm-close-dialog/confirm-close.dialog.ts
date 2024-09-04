import {Component} from "@angular/core";
import {
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {CoreModule} from "app/core/core.module";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'confirm-close-dialog',
  templateUrl: './confirm-close.dialog.html',
  styleUrl: './confirm-close.dialog.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, MatButton, TranslateModule],
})
export class ConfirmCloseDialog {

  constructor(private dialogRef: MatDialogRef<ConfirmCloseDialog>) {
  }

  submit(res: boolean = true) {
    this.dialogRef.close(res);
  }
}
