import {Routes} from '@angular/router';
import {authRoutes} from "app/pages/auth/auth.routes";
import {SummaryComponent} from "app/pages/summary/summary.component";
import { SearchComponent } from 'app/pages/search/search.component';
import {ArticleComponent} from "app/pages/article/article.component";

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: SummaryComponent,
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'article',
    component: ArticleComponent
  }
];
