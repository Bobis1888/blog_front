import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {ViewContentComponent} from "./view/view-content.component";
import {EditContentComponent} from "./edit/edit-content.component";
import {AuthService} from "app/core/service/auth/auth.service";

export const contentGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};
export const contentRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'view/:id',
        component: ViewContentComponent,
        data: {animation: 'ViewContentComponent'},
        canActivate: [],
      },
      {
        path: 'edit',
        component: EditContentComponent,
        data: {animation: 'EditContentComponent'},
        canActivate: [contentGuard],
      },
      {
        path: 'edit/:id',
        component: EditContentComponent,
        data: {animation: 'EditContentComponent'},
        canActivate: [contentGuard],
      }
    ]
  },
];
