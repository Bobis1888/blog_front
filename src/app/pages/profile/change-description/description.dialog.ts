import {Component, Inject, OnInit} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";
import {AuthService} from "app/core/service/auth/auth.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {MatInput} from "@angular/material/input";
import {HasErrors} from "app/core/abstract/has-errors";
import {DeviceDetectorService} from "ngx-device-detector";
import {replaceLinksWithHtmlTags} from "app/core/utils";

export interface DialogData {
  description: string;
}

@Component({
  selector: 'description-dialog',
  templateUrl: './description.dialog.html',
  styleUrl: './description.dialog.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatInput],
})
export class ChangeDescriptionDialog extends HasErrors implements OnInit {

  protected maxLength = 512;

  constructor(
    private dialogRef: MatDialogRef<ChangeDescriptionDialog>,
    protected deviceDetector: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    private authService: AuthService) {
    super();
  }

  get description(): FormControl {
    return this.formGroup?.get('description') as FormControl;
  }

  get count(): string {
    return (this.maxLength - (this.description?.value?.length ?? 0)) + '/' + this.maxLength;
  }

  get isMobile(): boolean {
    return this.deviceDetector.isMobile();
  }

  ngOnInit() {
    this.formGroup.addControl(
      'description',
      new FormControl(
        this.data.description,
      )
    );

    this.formGroup.get('description')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unSubscriber)
      )
      .subscribe({
      next: it => {
        it = replaceLinksWithHtmlTags(it);

        if (it.length <= this.maxLength) {
          this.description?.setValue(it, {emitEvent: false});
        }
      }
    });
  }

  saveNickname(): void {
    let description = this.description?.value;

    description = replaceLinksWithHtmlTags(description);

    this.authService
      .changeDescription(description)
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: (res: SuccessDto) => this.dialogRef.close(description),
      error: () => this.dialogRef.close(false),
    })
  }

  close() {
    this.dialogRef.close();
  }

  protected readonly FormControl = FormControl;

  onKeydown($event: KeyboardEvent) {

    if ($event.key == 'Enter') {
      this.description.setValue(this.description.value.trim() + '<br>');
    }
  }
}
