import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule} from "@ngx-translate/core";
import {takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HasErrors} from "app/core/abstract/has-errors";
import {AuthService} from "app/core/service/auth/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.less'
})
export class ChangePasswordComponent extends HasErrors implements OnInit {

  constructor(protected authService: AuthService,
              protected router: Router,
              protected aRouter: ActivatedRoute,
              protected deviceService: DeviceDetectorService,
              protected matSnackBar: MatSnackBar) {
    super();
  }

  private uuid: string = "";
  hide: boolean = true;
  loading: boolean = false;
  state: 'form' | 'message' = 'form';
  ref?: MatSnackBarRef<any>;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit() {
    this.formGroup.addControl('password', new FormControl('', [Validators.minLength(8)]));
    this.formGroup.addControl('passwordRepeat', new FormControl('', [
        Validators.minLength(8),
        (control: AbstractControl): ValidationErrors | null => {
          return control.value != this.formGroup?.get("password")?.value ? {notEqual: true} : null;
        }
      ]
    ));
    this.uuid = this.aRouter.snapshot.queryParamMap.get("uuid") ?? "";
  }

  submit(): void {

    if (this.loading) {
      return;
    }

    this.clearErrors();

    if (this.formGroup.valid) {
      this.loading = true;
      let password = this.formGroup.get("password")?.value;

      this.authService
        .changePassword(password, this.uuid)
        .pipe(
          takeUntil(this.unSubscriber),
        ).subscribe({
        next: (res: SuccessDto) => {
          this.loading = false;

          if (res.success) {
            this.state = 'message';
            return;
          }
        },
        error: (err) => {
          this.loading = false;
          this.rejectErrors(...err.errors);

          if (this.getErrors("password")) {
            this.ref = this.matSnackBar.open(this.translate.instant("errors.passwordHelp"), "OK", {duration: 20000});
          }
        }
      })
    }
  }

  override ngOnDestroy() {
    this.ref?.dismiss();
    super.ngOnDestroy();
    super.ngOnDestroy();
  }
}
