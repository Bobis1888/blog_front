import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from "@angular/router";
import {ViewArticleComponent} from "app/pages/article/view/view-article.component";
import {EditArticleComponent} from "app/pages/article/edit/edit-article.component";
import {AuthService} from "app/core/service/auth/auth.service";

export const articleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};
export const articleRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'view/:id',
        component: ViewArticleComponent,
        data: {animation: 'ViewArticleComponent'},
        canActivate: [],
      },
      {
        path: 'edit/reload/:id',
        redirectTo: 'edit/:id',
        data: {animation: 'ReloadEditArticleComponent'},
      },
      {
        path: 'edit',
        component: EditArticleComponent,
        data: {animation: 'EditArticleComponent'},
        canActivate: [articleGuard],
      },
      {
        path: 'edit/:id',
        component: EditArticleComponent,
        data: {animation: 'EditArticleComponent'},
        canActivate: [articleGuard],
      }
    ]
  },
];
