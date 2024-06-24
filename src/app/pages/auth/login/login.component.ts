import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {mergeAll, mergeMap, takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {UserInfo} from "app/core/service/auth/user-info";

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
              private authService: AuthService,
              private deviceService: DeviceDetectorService) {
    super();
  }

  protected hide: boolean = true;
  protected loading: boolean = false;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.title.setTitle(this.translate.instant('loginPage.metaTitle'));

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
}
