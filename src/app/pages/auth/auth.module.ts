import {inject, NgModule} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
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
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'confirm-registration',
    component: ConfirmRegistrationComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthModule {
}
