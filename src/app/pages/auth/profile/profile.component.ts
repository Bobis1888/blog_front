import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {SuccessDto} from "app/core/dto/success-dto";
import {TranslateModule} from "@ngx-translate/core";
import {HasErrors} from "app/core/abstract/has-errors";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CoreModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent extends HasErrors implements OnInit {

  constructor(private formBuilder: FormBuilder,
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
    this.title.setTitle(this.translate.instant('profilePage.title'));
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
