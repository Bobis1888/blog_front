import {Routes} from '@angular/router';
import {SummaryComponent} from "app/pages/summary/summary.component";
import {SearchComponent} from 'app/pages/search/search.component';
import {BadGatewayComponent} from "app/pages/bad-gateway/bad-gateway.component";

export const routes: Routes = [
  {
    path: '',
    component: SummaryComponent,
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'update-process',
    component: BadGatewayComponent
  },
  {
    path: 'article',
    loadChildren: () => import('app/pages/article/article.module').then(m => m.ArticleModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('app/pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '**',
    component: SummaryComponent
  }
];
