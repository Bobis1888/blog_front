import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {SuccessDto} from "src/app/core/dto/success-dto";
import {takeUntil} from "rxjs";
import {AuthService} from "app/core/service/auth/auth.service";
import {HasErrors} from "app/core/abstract/has-errors";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Metrika} from "ng-yandex-metrika";
import {LoginComponent} from "app/pages/auth/login/login.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

export class PasswordIndicator {
  color: string;
  state: string;

  constructor(color: string, state: string) {
    this.color = color;
    this.state = state;
  }
}


@Component({
  selector: 'registration',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.less'
})
export class RegistrationComponent extends HasErrors implements OnInit {

  constructor(protected authService: AuthService,
              protected router: Router,

              protected deviceService: DeviceDetectorService,
              protected metrika: Metrika,
              protected matSnackBar: MatSnackBar) {
    super();

    this.matDialog = inject(MatDialog);

    if (!this.isMobile) {
      this.matRef = inject(MatDialogRef<RegistrationComponent>);
    }
  }
  private matDialog: MatDialog;
  private matRef?: MatDialogRef<RegistrationComponent>;
  ref?: MatSnackBarRef<any>;
  hide: boolean = true;
  loading: boolean = false;
  state: 'form' | 'message' = 'form';

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get passwordIndicator(): PasswordIndicator {
    let color = "red";
    let state = "weak";


    if (this.formGroup != null && this.formGroup?.get("password")?.value?.length >= 8) {
      color = "green";
      state = "strong";
    }

    return new PasswordIndicator(color, state);
  }

  ngOnInit(): void {
    this.translate.get('registrationPage.metaTitle').subscribe({next: (it) => this.title.setTitle(it)});
    this.formGroup.addControl('email', new FormControl('', [Validators.required, Validators.email]));
    this.formGroup.addControl('password', new FormControl('', [Validators.minLength(8)]));
    this.formGroup.addControl('passwordRepeat', new FormControl('', [
        Validators.minLength(8),
        (control: AbstractControl): ValidationErrors | null => {
          return control.value != this.formGroup?.get("password")?.value ? {notEqual: true} : null;
        }
      ]
    ));

    this.metrika.reachGoal('open_registration_page');
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
  }

  submit(): void {

    if (this.loading) {
      return;
    }

    this.clearErrors();

    if (this.formGroup.valid) {
      this.loading = true;
      let email = this.formGroup.get("email")?.value;
      let password = this.formGroup.get("password")?.value;

      this.authService
        .registration(email, password)
        .pipe(
          takeUntil(this.unSubscriber),
        )
        .subscribe({
          next: (res: SuccessDto) => {
            this.loading = false;

            if (res.success) {
              this.state = 'message';
              this.metrika.reachGoal('registration');
              return;
            }
          },
          error: (err) => {
            this.loading = false;
            this.rejectErrors(...err.errors)

            if (this.getErrors("password")) {
              this.ref = this.matSnackBar.open(this.translate.instant("errors.passwordHelp"), "OK", {duration: 20000});
            }
          }
        });
    }
  }

  openLogin() {

    if (this.isMobile) {
      this.router.navigate(['auth', 'login']).then();
      return;
    }

    this.matRef?.close();
    this.matDialog.open(LoginComponent, {});
  }
}
