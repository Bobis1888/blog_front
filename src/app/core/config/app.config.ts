import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withDebugTracing,
  withInMemoryScrolling,
} from '@angular/router';

import {routes} from './app.routes';
import {TranslateModule} from "@ngx-translate/core";
import {provideTranslation} from "src/app/core/config/app.translate.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {appCoreInterceptor} from "src/app/core/config/app.core.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MetrikaModule} from 'ng-yandex-metrika';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing(),
      inMemoryScrollingFeature
    ),
    importProvidersFrom(MetrikaModule.forRoot([
      // {id: 0},
      {id: 97893121, webvisor: true}
    ])),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideAnimations(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
  ]
};
