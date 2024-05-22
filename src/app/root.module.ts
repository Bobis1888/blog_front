import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "app/core/service/auth/auth.service";
import {HttpSenderService} from "app/core/service/base/http-sender.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppCoreInterceptor} from "app/config/app.core.interceptor";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    RouterOutlet,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    AuthService,
    HttpSenderService,
    {provide: HTTP_INTERCEPTORS, useClass: AppCoreInterceptor, multi: true}
  ]
})
export class RootModule {
}
