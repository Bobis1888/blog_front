import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {RegistrationComponent} from "./registration/registration.component";
import {ConfirmRegistrationComponent} from "./confirm-registration/confirm-registration.component";
import {LoginComponent} from "./login/login.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ProfileComponent} from "app/pages/auth/profile/profile.component";

export const nonAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return !authService.isAuthorized;
};

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'registration',
        component: RegistrationComponent,
        data: {animation: 'RegistrationComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'confirm-registration',
        component: ConfirmRegistrationComponent,
        data: {animation: 'ConfirmRegistrationComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {animation: 'ConfirmRegistrationComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'forgot-password',
        component: ResetPasswordComponent,
        data: {animation: 'ResetPasswordComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {animation: 'ChangePasswordComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {animation: 'ProfileComponent'},
        canActivate: [authGuard],
      }
    ]
  },
];
