import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {RootModule} from "src/app/root.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Router} from "@angular/router";

@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [RootModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.less'
})
export class ResetPasswordComponent extends HasErrors implements OnInit {

  constructor(private formBuilder: FormBuilder,
              translate: TranslateService,
              private router: Router,
              private authService: AuthService,
              private deviceService: DeviceDetectorService) {
    super(translate);
  }

  protected loading: boolean = false;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  reset(): void {

    if (this.loading) {
      return;
    }

    this.clearErrors();

    if (this.formGroup.valid) {
      this.loading = true;
      let email = this.formGroup.get("email")?.value;

      this.authService
        .resetPassword(email)
        .pipe(
          takeUntil(this.unSubscriber),
        ).subscribe({
        next: (res: SuccessDto) => {
          this.loading = false;

          if (res.success) {
            this.router.navigate(["/login"]);
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
}
