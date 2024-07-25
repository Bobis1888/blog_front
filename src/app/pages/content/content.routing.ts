import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {ViewContentComponent} from "./view/view-content.component";
import {EditContentComponent} from "./edit/edit-content.component";
import {AuthService} from "app/core/service/auth/auth.service";
import {ViewByLinkContentComponent} from "app/pages/content/view-by-link/view-by-link-content.component";

export const contentGuard: CanActivateFn = () => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};

const deactivateGuard: CanDeactivateFn<EditContentComponent> = (component: EditContentComponent, currentRoute: ActivatedRouteSnapshot, nextState: RouterStateSnapshot) => {
  return component.canDeactivate(nextState.url);
}

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
        canDeactivate: [deactivateGuard],
      },
      {
        path: 'edit/:id',
        component: EditContentComponent,
        data: {animation: 'EditContentComponent'},
        canActivate: [contentGuard],
        canDeactivate: [deactivateGuard],
      },
      {
        path: ':link',
        component: ViewByLinkContentComponent,
        data: {animation: 'ViewByLinkContentComponent'},
        canActivate: [],
      },
    ]
  },
];
