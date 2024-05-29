import {Routes} from "@angular/router";
import {RegistrationComponent} from "./registration/registration.component";
import {ConfirmRegistrationComponent} from "./confirm-registration/confirm-registration.component";
import {LoginComponent} from "app/pages/auth/login/login.component";
import {ResetPasswordComponent} from "src/app/pages/auth/reset-password/reset-password.component";
import {ChangePasswordComponent} from "app/pages/auth/change-password/change-password.component";

export const authRoutes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'confirm-registration',
    component: ConfirmRegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },

];
