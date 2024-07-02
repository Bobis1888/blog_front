import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "src/app/core/core.module";
import {AuthService} from "src/app/core/service/auth/auth.service";
import {HasErrors} from "src/app/core/abstract/has-errors";
import {catchError, map, mergeMap, of, takeUntil, throwError} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {UserInfo} from "src/app/core/service/auth/user-info";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ChangeNicknameDialog} from "app/pages/profile/change-nickname/nickname.dialog";
import {MatSelect} from "@angular/material/select";
import {Router} from "@angular/router";
import {ChangeLanguageDialog} from "app/pages/profile/change-language/language.dialog";
import {StatisticsService} from "app/core/service/content/statistics.service";
import {Statistics} from "app/core/service/content/statistics";
import {ChangeDescriptionDialog} from "app/pages/profile/change-description/description.dialog";
import {ChangeAvatarDialog} from "app/pages/profile/change-avatar/avatar.dialog";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, MatSelect, FormsModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent extends HasErrors implements OnInit {

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              protected statisticsService: StatisticsService,
              protected router: Router,
              private deviceService: DeviceDetectorService) {
    super();
  }

  protected state: 'form' | 'load' = 'load';
  protected info: UserInfo = {
    statistics: {} as Statistics
  } as UserInfo;
  private ref: MatSnackBarRef<any> | null = null;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.title.setTitle(this.translate.instant('profilePage.metaTitle'));
    this.formGroup.addControl('nickname', new FormControl('', [Validators.required]));

    this.state = 'load';
    this.authService
      .info(true)
      .pipe(
        takeUntil(this.unSubscriber),
        map<UserInfo, void>(it => this.info = it),
        mergeMap(() => this.statisticsService.get()),
        map<Statistics, void>(it => this.info.statistics = it),
        catchError((err) => of(err))
      ).subscribe({
      next: () => this.state = 'form',
      error: () => this.state = 'load'
    });
  }

  openEditNicknameDialog() {
    this.state = 'load';
    this.dialog.open(ChangeNicknameDialog, {
      data: {nickname: this.info.nickname},
      autoFocus: false
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

        this.state = 'form';
      },
      error: () => this.state = 'form'
    });
  }

  openEditDescriptionDialog() {
    this.state = 'load';
    this.dialog.open(ChangeDescriptionDialog, {
      data: {description: this.info.description},
      autoFocus: false
    })
      .afterClosed()
      .pipe(takeUntil(this.unSubscriber)).subscribe({
      next: it => {

        if (it) {
          this.ref?.dismiss();
          this.info.description = it;
          let message = this.translate.instant('profilePage.successMessage');
          this.ref = this.snackBar.open(message, undefined, {duration: 3000});
        }

        this.state = 'form';
      },
      error: () => this.state = 'form'
    });
  }

  openEditAvatarDialog() {
    this.state = 'load';
    this.dialog.open(ChangeAvatarDialog)
      .afterClosed()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {

          if (it) {
            this.ref?.dismiss();
            this.info.description = it;
            let message = this.translate.instant('profilePage.successMessage');
            this.ref = this.snackBar.open(message, undefined, {duration: 3000});
          }

          this.state = 'form';
        },
        error: () => this.state = 'form'
      });
  }

  resetPassword() {

    if (this.state == 'load') {
      return;
    }

    this.state = 'load';
    this.authService.resetPassword(this.info.email)
      .pipe(
        takeUntil(this.unSubscriber)
      ).subscribe({
      next: it => {
        this.state = 'form';

        if (it.success) {
          let message = this.translate.instant('profilePage.resetPasswordMessage');
          this.ref = this.snackBar.open(message, 'OK', {duration: 3000});
        }
      },
      error: () => this.state = 'form'
    });
  }

  openChangeLanguageDialog() {
    this.state = 'load';
    this.dialog.open(ChangeLanguageDialog).afterClosed()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({next: () => this.state = 'form'});
  }

  logout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(() => {
        this.router.navigate(['/']).then();
        return;
      });
  }
}
