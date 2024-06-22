import {Routes} from '@angular/router';
import {SearchComponent} from 'app/pages/search/search.component';

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
    path: 'article',
    loadChildren: () => import('app/pages/article/article.routing')
      .then(r => r.articleRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('app/pages/auth/auth.routing')
      .then(r => r.authRoutes),
  },
  {
    path: 'profile',
    data: {animation: 'ProfileComponent'},
    loadComponent: () => import('app/pages/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'about',
    redirectTo: 'landing'
  },
  {
    path: 'landing',
    data: {animation: 'LandingComponent'},
    loadComponent: () => import('app/pages/landing-page/landing.component')
      .then(m => m.LandingComponent),
  }
];
