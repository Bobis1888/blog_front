import {Routes} from '@angular/router';
import {SummaryComponent} from "app/pages/summary/summary.component";
import {SearchComponent} from 'app/pages/search/search.component';
import {BadGatewayComponent} from "app/pages/bad-gateway/bad-gateway.component";

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
    component: BadGatewayComponent,
    data: {animation: 'BadGatewayComponent'}
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
