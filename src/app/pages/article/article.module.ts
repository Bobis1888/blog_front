import {inject, NgModule} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes} from "@angular/router";
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
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view/:id',
    component: ViewArticleComponent,
    canActivate: [],
  },
  {
    path: 'edit',
    component: EditArticleComponent,
    canActivate: [articleGuard],
  },
  {
    path: 'edit/:id',
    component: EditArticleComponent,
    canActivate: [articleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(articleRoutes)],
  exports: [RouterModule]
})
export class ArticleModule {}
