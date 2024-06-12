import {Routes} from '@angular/router';
import {SummaryComponent} from "app/pages/summary/summary.component";
import {SearchComponent} from 'app/pages/search/search.component';

export const routes: Routes = [
  {
    path: '',
    component: SummaryComponent,
    data: {animation: 'SummaryComponent'}
  },
  {
    path: 'search',
    component: SearchComponent,
    data: {animation: 'SearchComponent'}
  },
  {
    path: 'update-process',
    data: {animation: 'BadGatewayComponent'},
    loadChildren: () => import('app/pages/bad-gateway/bad-gateway.component').then(m => m.BadGatewayComponent),
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
  }
];
