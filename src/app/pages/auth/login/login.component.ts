import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {catchError, takeUntil} from "rxjs";

@Component({
  selector: 'login',
  standalone: true,
  imports: [RootModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent extends UnSubscriber implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {
    super();
  }

  hide: boolean = true;

  formGroup: FormGroup = this.formBuilder.group({
    emailCtrl: new FormControl('', [Validators.required, Validators.email]),
    passwordCtrl: new FormControl('', [Validators.required])
  });


  ngOnInit(): void {
  }

  login(): void {

    if (this.formGroup.valid) {

      let email = this.formGroup.get("emailCtrl")?.value;
      let password = this.formGroup.get("passwordCtrl")?.value;

      this.authService
        .login(email, password)
        .pipe(
          takeUntil(this.unSubscriber),
        )
        .subscribe((res: SuccessDto) => {

          if (res.success) {
            this.router.navigate(["/"]);
            return;
          }
        }, error => {
          console.log("error", error)
        });
    }
  }

  goToReg() {
    this.router.navigate(['/registration']);
    return;
  }

  goToRestorePassword() {
    this.router.navigate(['/restore-password']);
    return;
  }
}
