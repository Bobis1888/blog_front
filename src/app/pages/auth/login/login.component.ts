import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {mergeMap, takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {UserInfo} from "app/core/service/auth/user-info";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RegistrationComponent} from "app/pages/auth/registration/registration.component";
import {ResetPasswordComponent} from "app/pages/auth/reset-password/reset-password.component";

@Component({
  selector: 'login',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent extends HasErrors implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,

              private dialog: MatDialog,
              private authService: AuthService,
              private deviceService: DeviceDetectorService) {
    super();

    if (!this.isMobile) {
      this.dialogRef = inject(MatDialogRef<LoginComponent>);
    }
  }

  protected hide: boolean = true;
  protected loading: boolean = false;
  private dialogRef?: MatDialogRef<LoginComponent>;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {

    this.translate.get('loginPage.metaTitle').subscribe({
      next: (it) => this.title.setTitle(it)
    });

    this.formGroup = this.formBuilder.group({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  login(): void {

    if (this.loading) {
      return;
    }

    this.clearErrors();

    if (this.formGroup.valid) {
      this.loading = true;
      let email = this.formGroup.get("login")?.value;
      let password = this.formGroup.get("password")?.value;

      this.authService
        .login(email, password)
        .pipe(
          takeUntil(this.unSubscriber),
          mergeMap(() => this.authService.info(true)),
        ).subscribe({
        next: (res: UserInfo) => {
          this.loading = false;

          if (res) {
            this.router.navigate(["/"]).then();
            return;
          }
        },
        error: (err) => {
          this.loading = false;
          this.rejectErrors(...err.errors);
        }
      })
    }
  }

  openRegistration() {

    if (this.isMobile) {
      this.router.navigate(['auth', 'registration']).then();
      return;
    }

    this.dialogRef?.close();
    this.dialog.open(RegistrationComponent, {});
  }

  openForgotPassword() {

    if (this.isMobile) {
      this.router.navigate(['auth', 'forgot-password']).then();
      return;
    }

    this.dialogRef?.close();
    this.dialog.open(ResetPasswordComponent, {});
  }
}
