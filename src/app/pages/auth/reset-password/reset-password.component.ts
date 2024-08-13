import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'forgot-password',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.less'
})
export class ResetPasswordComponent extends HasErrors implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private deviceService: DeviceDetectorService) {
    super();
  }

  protected loading: boolean = false;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    let email = this.aRouter.snapshot.queryParams['email'] ?? '';
    this.translate.get('resetPasswordPage.metaTitle').subscribe({next: (it) => this.title.setTitle(it)});
    this.formGroup = this.formBuilder.group({
      email: new FormControl(email, [Validators.required, Validators.email]),
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
            this.router.navigate(["/auth/login"]).then();
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
