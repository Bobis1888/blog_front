import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {AuthService} from "app/core/service/auth/auth.service";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";

export const nonAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return !authService.isAuthorized;
};

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {animation: 'LoginComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        data: {animation: 'RegistrationComponent'},
        canActivate: [nonAuthGuard],
      },
      {
        path: 'confirm-registration',
        data: {animation: 'ConfirmRegistrationComponent'},
        canActivate: [nonAuthGuard],
        loadComponent: () => import('app/pages/auth/confirm-registration/confirm-registration.component')
          .then(m => m.ConfirmRegistrationComponent)
      },
      {
        path: 'forgot-password',
        data: {animation: 'ResetPasswordComponent'},
        canActivate: [nonAuthGuard],
        loadComponent: () => import('app/pages/auth/reset-password/reset-password.component')
          .then(m => m.ResetPasswordComponent)
      },
      {
        path: 'change-password',
        data: {animation: 'ChangePasswordComponent'},
        canActivate: [nonAuthGuard],
        loadComponent: () => import('app/pages/auth/change-password/change-password.component')
          .then(m => m.ChangePasswordComponent)
      },

    ]
  },
];
