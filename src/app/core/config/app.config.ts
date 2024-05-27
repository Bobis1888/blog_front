import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TranslateModule} from "@ngx-translate/core";
import {provideTranslation} from "src/app/core/config/app.translate.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {appCoreInterceptor} from "src/app/core/config/app.core.interceptor";

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
