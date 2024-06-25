import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {
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

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideRouter(
      routes,
      withDebugTracing(),
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'} as InMemoryScrollingOptions),
    ),
    provideAnimations(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
  ]
};
