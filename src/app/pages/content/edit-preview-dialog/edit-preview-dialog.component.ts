import {Component, Inject, OnInit} from "@angular/core";
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
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {Validators} from "ngx-editor";

export interface DialogData {
  id: string;
  content: string
}

@Component({
  selector: 'edit-preview-dialog',
  templateUrl: './edit-preview-dialog.component.html',
  styleUrl: './edit-preview-dialog.component.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, MatButton, TranslateModule, ReactiveFormsModule],
})
export class EditPreviewDialog extends HasErrors implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditPreviewDialog>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    protected deviceService: DeviceDetectorService,
    private contentService: ContentService) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get contentLength(): number {
    return this.formGroup.get('content')?.value?.length || 0;
  }

  ngOnInit(): void {
    this.formGroup.addControl('content',
      new FormControl(this.data.content ?? '', Validators.required()));
  }

  submit(): void {

    if (this.formGroup.valid) {
      this.contentService.changePreview(this.data.id, {
        content: this.formGroup.get('content')?.value
      })
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
          next: () => this.dialogRef.close(true)
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
