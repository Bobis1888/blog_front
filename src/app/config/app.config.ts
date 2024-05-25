import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TranslateModule} from "@ngx-translate/core";
import {provideTranslation} from "app/config/app.translate.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {appCoreInterceptor} from "app/config/app.core.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
    importProvidersFrom(
      TranslateModule.forRoot(provideTranslation())
    )
  ]
};
