import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreModule} from "app/core/core.module";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {StorageService, UploadResponse} from "app/core/service/content/storage.service";
import {animations} from "app/core/config/app.animations";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import { FileType } from "app/core/service/content/storage.service";


interface DialogData {
  imagePath: string;
  hasImage: boolean;
}

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
  protected error: string = '';
  protected file: File | null = null;
  protected newAvatarPreview: string = '';

  constructor(
    private dialogRef: MatDialogRef<ChangeAvatarDialog>,
    protected deviceService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    private storageService: StorageService) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  close() {
    this.dialogRef.close(false);
  }

  save() {
    if (this.file) {
      this.storageService.upload(this.file, FileType.AVATAR)
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
          next: (it: UploadResponse) => this.dialogRef.close(it),
          error: () => this.dialogRef.close(false),
        })
    }
  }

  handleFile($event: any) {
    this.error = '';
    this.file = null;

    if ($event instanceof File) {
      this.file = $event;
    } else if ($event.target?.files?.length > 0) {
      this.file = $event.target.files[0];
    }

    if ((this.file?.size ?? 0) > (this.maxSize * 1024 * 1024)) {
      this.file = null;
      this.error = this.translate.instant('errors.image.maxSize', {maxSize: this.maxSize})
    }

    if (this.file) {

      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.file!);
      let me = this

      fileReader.onload = function () {
        me.newAvatarPreview = fileReader.result as string;
      };
    }
  }
}
