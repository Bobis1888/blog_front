import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [RootModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent extends HasErrors implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              translate: TranslateService,
              private authService: AuthService,
              private deviceService: DeviceDetectorService) {
    super(translate);
  }

  protected hide: boolean = true;
  protected loading: boolean = false;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nickName: new FormControl('', [Validators.required]),
      password: new FormControl('', [])
    });
  }

  save(): void {

    if (this.loading) {
      return;
    }

    this.clearErrors();

    if (this.formGroup.valid) {
      this.loading = true;
      let nickName = this.formGroup.get("nickName")?.value;
      let password = this.formGroup.get("password")?.value;

      this.authService
        .saveInfo(nickName, password)
        .pipe(
          takeUntil(this.unSubscriber),
        ).subscribe({
        next: (res: SuccessDto) => {
          this.loading = false;

          if (res.success) {

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
