import {Routes} from '@angular/router';
import {authRoutes} from "src/app/pages/auth/auth.routes";
import {SummaryComponent} from "src/app/pages/summary/summary.component";
import {ResetPasswordComponent} from "src/app/pages/auth/reset-password/reset-password.component";
import {ChangePasswordComponent} from "app/pages/auth/change-password/change-password.component";

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: SummaryComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  }
];
