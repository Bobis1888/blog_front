import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {SuccessDto} from "src/app/core/dto/success-dto";
import {takeUntil} from "rxjs";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {AuthService} from "app/core/service/auth/auth.service";

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
  imports: [RootModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.less'
})
export class RegistrationComponent extends UnSubscriber implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    super();
  }

  hide: boolean = true;

  formGroup: FormGroup = this.formBuilder.group({
    emailCtrl: new FormControl('', [Validators.required, Validators.email]),
    passwordCtrl: new FormControl('', [
      Validators.minLength(8)]),
    passwordRepeatCtrl: new FormControl('', [
      Validators.minLength(8),
      control => control.value === this.formGroup?.get("passwordCtrl")?.value ? null : {notEqual: true}])
  });

  get passwordIndicator(): PasswordIndicator {
    let color = "red";
    let state = "слабый";

    if (this.formGroup != null && this.formGroup?.get("passwordCtrl")?.value?.length >= 8) {
      color = "green";
      state = "сильный";
    }

    return new PasswordIndicator(color, state);
  }

  get passNotEqual(): boolean {
    let formControl = this.formGroup.get('passwordRepeatCtrl');
    return formControl?.valid == false && formControl?.value != '';
  }

  ngOnInit(): void {
  }

  goTo(): void {

    if (this.formGroup.valid) {

      let email = this.formGroup.get("emailCtrl")?.value;
      let password = this.formGroup.get("passwordCtrl")?.value;

      this.authService
        .registration(email, password)
        .pipe(takeUntil(this.unSubscriber))
        .subscribe((res: SuccessDto) => {

          if (res.success) {
            this.router.navigate(['/confirm-registration']);
          }
        });
    }
  }
}
