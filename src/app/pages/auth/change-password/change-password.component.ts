import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute, Router} from "@angular/router";
import {RegistrationComponent as Registration} from "app/pages/auth/registration/registration.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.less'
})
export class ChangePasswordComponent extends Registration {

  constructor(translate: TranslateService,
              protected aRouter: ActivatedRoute,
              router: Router,
              authService: AuthService,
              deviceService: DeviceDetectorService,
              matSnackBar: MatSnackBar) {
    super(translate, authService, router, deviceService, matSnackBar);
  }

  private uuid: string = "";

  override ngOnInit() {
    super.ngOnInit();
    this.formGroup.removeControl('email');
    this.uuid = this.aRouter.snapshot.queryParamMap.get("uuid") ?? "";
  }


  override submit(): void {

    console.log('this', this.loading);
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
}
