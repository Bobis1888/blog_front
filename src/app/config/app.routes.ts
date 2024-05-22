import {Routes} from '@angular/router';
import {authRoutes} from "app/pages/auth/auth.routes";
import {SummaryComponent} from "app/pages/summary/summary.component";

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: SummaryComponent,
  }
];
