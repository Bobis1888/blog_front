import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes} from '@angular/router';
import {SearchComponent} from 'app/pages/search/search.component';
import {inject} from "@angular/core";
import {AuthService} from "app/core/service/auth/auth.service";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService = inject(AuthService);
  return authService.isAuthorized;
};

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('app/pages/summary/summary.routing')
      .then(r => r.summaryRouting)
  },
  {
    path: 'search',
    component: SearchComponent,
    data: {animation: 'SearchComponent'}
  },
  {
    path: 'update-process',
    data: {animation: 'BadGatewayComponent'},
    loadComponent: () => import('app/pages/bad-gateway/bad-gateway.component')
      .then(m => m.BadGatewayComponent),
  },
  {
    path: 'content',
    loadChildren: () => import('app/pages/content/content.routing')
      .then(r => r.contentRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('app/pages/auth/auth.routing')
      .then(r => r.authRoutes),
  },
  {
    path: 'profile',
    data: {animation: 'ProfileComponent'},
    canActivate: [authGuard],
    loadComponent: () => import('app/pages/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'landing',
    data: {animation: 'LandingComponent'},
    loadComponent: () => import('app/pages/landing-page/landing.component')
      .then(m => m.LandingComponent),
  },
  {
    path: 'notification',
    data: {animation: 'NotificationComponent'},
    loadComponent: () => import('app/pages/notification/notification.component')
      .then(m => m.NotificationComponent),
  }
];
