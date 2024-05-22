import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RootModule} from "app/root.module";
import {RegistrationService} from "app/core/service/registration.service";
import {SuccessDto} from "app/core/dto/success-dto";

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
export class RegistrationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private registrationService: RegistrationService) {
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

      this.registrationService
        .register(email, password)
        .subscribe((res: SuccessDto) => {

          if (res.success) {
            this.router.navigate(['/after-registration']);
          }
        });
    }
  }
}
