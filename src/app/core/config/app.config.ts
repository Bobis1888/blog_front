import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {PreloadAllModules, provideRouter, withDebugTracing, withPreloading} from '@angular/router';

import {routes} from './app.routes';
import {TranslateModule} from "@ngx-translate/core";
import {provideTranslation} from "src/app/core/config/app.translate.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {appCoreInterceptor} from "src/app/core/config/app.core.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withPreloading(PreloadAllModules),
      withDebugTracing()),
    provideAnimations(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
    importProvidersFrom(
      TranslateModule.forRoot(provideTranslation())
    )
  ]
};
