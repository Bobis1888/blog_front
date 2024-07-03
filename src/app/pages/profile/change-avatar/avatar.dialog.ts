import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {CoreModule} from "src/app/core/core.module";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {StorageService} from "app/core/service/content/storage.service";
import {animations} from "app/core/config/app.animations";
import {takeUntil} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";

@Component({
  selector: 'avatar-dialog',
  templateUrl: './avatar.dialog.html',
  styleUrl: './avatar.dialog.less',
  standalone: true,
  animations: animations,
  imports: [CoreModule],
})
export class ChangeAvatarDialog extends UnSubscriber {

  protected maxSize = 2;
  protected error: string  = '';
  protected file: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<ChangeAvatarDialog>,
    private storageService: StorageService) {
    super();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.file) {
      this.storageService.upload(this.file, 'avatar')
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
          next: (it: SuccessDto) => this.dialogRef.close(it.success),
          error: () => this.dialogRef.close(false),
        })
    }
  }

  change($event: any) {
    this.error = '';
    this.file = null;

    if ($event.target?.files?.length > 0) {
      this.file = $event.target.files[0];

      if ((this.file?.size ?? 0) > (this.maxSize * 1024 * 1024)) {
        this.file = null;
        this.error = this.translate.instant('errors.image.maxSize', {maxSize: this.maxSize})
        return

      }
    }
  }
}
