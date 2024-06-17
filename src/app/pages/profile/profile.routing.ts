import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {AuthService} from "src/app/core/service/auth/auth.service";
import {InfoComponent} from "./info/info.component";
import {ListComponent} from "src/app/pages/profile/list/list.component";
import {ProfileComponent} from "app/pages/profile/profile.component";
import {BookmarksComponent} from "app/pages/profile/bookmarks/bookmarks.component";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: InfoComponent,
        data: {animation: 'InfoComponent'},
        canActivate: [authGuard],
      },
      {
        path: 'list',
        component: ListComponent,
        data: {animation: 'ListComponent'},
        canActivate: [authGuard],
      },
      {
        path: 'bookmarks',
        component: BookmarksComponent,
        data: {animation: 'BookmarksComponent'},
        canActivate: [authGuard],
      }
    ]
  },
];
