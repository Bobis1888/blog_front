import {Component, Inject, OnInit} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {takeUntil} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";
import {HasErrors} from "app/core/abstract/has-errors";
import {AuthService} from "app/core/service/auth/auth.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {MaskitoOptions} from "@maskito/core";

export interface DialogData {
  nickname: string;
}

@Component({
  selector: 'nickname-dialog',
  templateUrl: './nickname.dialog.html',
  styleUrl: './nickname.dialog.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, ReactiveFormsModule],
})
export class ChangeNicknameDialog extends HasErrors implements OnInit {

  protected maxLengthNickname = 35;
  protected minLengthNickname = 5;

  constructor(
    private dialogRef: MatDialogRef<ChangeNicknameDialog>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    private authService: AuthService) {
    super();
  }

  readonly maskitoOpt: MaskitoOptions = {
    mask: this.mask,
    preprocessors: [
      ({elementState, data}) => ({
        data: data?.startsWith("@") ? data : "@" + data, elementState
      }),
    ]
  };

  protected get length(): string {
    return (this.maxLengthNickname - (this.nicknameCtrl?.value?.length ?? 0)) + '/' + this.maxLengthNickname;
  }

  private get mask() : RegExp[] {
    let res = [];
    res.push(/@/);

    for (let i = 0; i < this.maxLengthNickname; i++) {
      res.push(/[a-zA-Z_0-9]/);
    }

    return res;
  }

  protected get nicknameCtrl(): FormControl {
    return this.formGroup.get('nickname') as FormControl;
  }

  ngOnInit() {
    this.formGroup.addControl(
      'nickname',
      new FormControl(
        this.data.nickname,
        [
          Validators.required,
          Validators.minLength(this.minLengthNickname),
          Validators.maxLength(this.maxLengthNickname)
        ]
      )
    );
  }

  saveNickname(): void {

    if (this.validate()) {
      let nickname = this.formGroup.get("nickname")?.value;

      if (nickname == this.authService.userInfo.nickname) {
        this.reject('equal', 'nickname');
        return;
      }

      this.authService
        .changeNickname(nickname)
        .pipe(
          takeUntil(this.unSubscriber),
        ).subscribe({
        next: (res: SuccessDto) => {

          if (res.success) {
            this.dialogRef.close(nickname);
          }
        },
        error: (err) => {

          if (err.errors) {
            this.rejectErrors(...err.errors);
          } else {
            this.reject('error', 'nickname');
          }
        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
