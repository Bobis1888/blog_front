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

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideRouter(
      routes,
      withDebugTracing(),
      inMemoryScrollingFeature
    ),
    provideAnimations(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
  ]
};
