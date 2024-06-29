import {SummaryComponent} from "./summary.component";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes} from "@angular/router";
import {LineType, lineTypes} from "app/core/service/line/line.service";
import {LineComponent} from "app/pages/widgets/line/line.component";
import {inject} from "@angular/core";
import {AuthService} from "app/core/service/auth/auth.service";

export const summaryGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthorized) {
    return true
  }

  if (localStorage.getItem('firstLaunch') == null) {
    router.navigate(['landing']).then(() => localStorage.setItem('firstLaunch', 'true'));
    return false;
  }

  return true;
};
export const summaryRouting: Routes = [
  {
    path: '',
    component: SummaryComponent,
    data: {animation: 'SummaryComponent'},
    canActivate: [summaryGuard],
    children: [
      {
        path: '',
        component: LineComponent,
        data: {type: LineType.top}
      },
      ...lineTypes().map(it => {
        return {
          path: it,
          component: LineComponent,
          data: {type: it},
        };
      })
    ]
  },
];
