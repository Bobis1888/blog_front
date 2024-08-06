import {Component, Inject, OnInit} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {HasErrors} from "src/app/core/abstract/has-errors";
import {CoreModule} from "src/app/core/core.module";
import {takeUntil} from "rxjs";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {ReportDto, ReportService} from "app/core/service/report.service";

export interface DialogData {
  id: string;
}

@Component({
  selector: 'report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, MatButton, TranslateModule, ReactiveFormsModule],
})
export class ReportDialog extends HasErrors implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ReportDialog>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    protected deviceService: DeviceDetectorService,
    private reportService: ReportService) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get contentLength(): number {
    return this.formGroup.get('content')?.value?.length || 0;
  }

  ngOnInit(): void {
    this.formGroup.addControl('content', new FormControl);
  }

  submit(): void {
    this.reportService.report({
      articleId: this.data.id,
      type: 'report',
      description: this.formGroup.get('content')?.value
    } as ReportDto)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => this.close(true)
      });
  }

  close(res: boolean = false) {
    this.dialogRef.close(res);
  }
}
