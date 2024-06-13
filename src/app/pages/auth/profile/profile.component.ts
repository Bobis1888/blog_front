import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {HasErrors} from "app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {UserInfo} from "app/core/service/auth/user-info";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ChangeNicknameDialog} from "app/pages/auth/profile/dialog/nickname.dialog";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent extends HasErrors implements OnInit {

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService) {
    super();
  }

  protected state: 'form' | 'load' = 'load';
  protected hideEmail: boolean = true;
  protected showBottomProgress: boolean = false;
  protected info: UserInfo = {} as UserInfo;
  private ref: MatSnackBarRef<any> | null = null;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.title.setTitle(this.translate.instant('profilePage.title'));
    this.formGroup.addControl('nickname', new FormControl('', [Validators.required]));

    this.state = 'load';
    this.authService
      .info()
      .pipe(
        takeUntil(this.unSubscriber),
      ).subscribe({
      next: it => {
        this.state = 'form';
        this.info = it;
      },
      error: () => this.state = 'load'
    });
  }

  openEditDialog() {
    this.dialog.open(ChangeNicknameDialog, {
      data: {nickname: this.info.nickname}
    })
      .afterClosed()
      .pipe(takeUntil(this.unSubscriber)).subscribe({
      next: it => {

        if (it) {
          this.ref?.dismiss();
          this.info.nickname = it;
          let message = this.translate.instant('profilePage.successMessage');
          this.ref = this.snackBar.open(message, undefined, {duration: 3000});
        }
      }
    });
  }

  resetPassword() {

    if (this.showBottomProgress) {
      return;
    }

    this.showBottomProgress = true;
    this.authService.resetPassword(this.info.email)
      .pipe(
        takeUntil(this.unSubscriber)
      ).subscribe({
      next: it => {
        this.showBottomProgress = false;

        if (it.success) {
          let message = this.translate.instant('profilePage.resetPasswordMessage');
          this.ref = this.snackBar.open(message, 'OK', {duration: 3000});
        }
      },
      error: () => this.showBottomProgress = false
    });
  }

  addImage() {
    this.ref?.dismiss();
    let message = this.translate.instant('profilePage.addImage');
    this.ref = this.snackBar.open(message, undefined, {duration: 3000})
  }
}
