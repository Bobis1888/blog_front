import {Routes} from "@angular/router";
import {RegistrationComponent} from "./registration/registration.component";
import {ConfirmRegistrationComponent} from "./confirm-registration/confirm-registration.component";
import {LoginComponent} from "app/pages/auth/login/login.component";

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
];
