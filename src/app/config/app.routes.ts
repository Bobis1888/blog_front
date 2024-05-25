import {Routes} from '@angular/router';
import {authRoutes} from "app/pages/auth/auth.routes";
import {SummaryComponent} from "app/pages/summary/summary.component";
import {ResetPasswordComponent} from "app/pages/auth/reset-password/reset-password.component";

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: SummaryComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
];
