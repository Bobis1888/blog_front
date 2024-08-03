import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withDebugTracing,
  withInMemoryScrolling,
} from '@angular/router';

import {routes} from './app.routes';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {provideTranslation} from "src/app/core/config/app.translate.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {appCoreInterceptor} from "src/app/core/config/app.core.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MetrikaModule} from 'ng-yandex-metrika';
import {NgxEditorModule} from "ngx-editor";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu, 'ru');

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
      {id: 0},
      // {id: 97893121, webvisor: true}
    ])),
    importProvidersFrom(NgxEditorModule.forRoot({
      // todo locale
      locals: {
        bold: 'Жирный',
        italic: 'Курсив',
        code: 'Код',
        blockquote: 'Цитата',
        underline: 'Подчеркивание',
        strike: 'Зачеркнутый',
        heading: 'Заголовок',
        h1: 'Заголовок 1',
        h2: 'Заголовок 2',
        h3: 'Заголовок 3',
        h4: 'Заголовок 4',
        h5: 'Заголовок 5',
        h6: 'Заголовок 6',
        align_left: 'По левому краю',
        align_center: 'По центру',
        align_right: 'По правому краю',
        align_justify: 'По ширине',

        // popups, forms, others...
        url: 'URL',
        text: 'Текст',
        openInNewTab: 'Открывать в новом окне',
        insert: 'Вставить',
        altText: 'Альтернативный текст',
        title: 'Заголовок',
        remove: 'Удалить',
        enterValidUrl: 'Введённое значение не является ссылкой',
      }
    })),
    {
      provide: LOCALE_ID,
      deps: [TranslateService],
      useFactory: (translateService: TranslateService) => translateService.getDefaultLang()
    },
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideAnimations(),
    provideHttpClient((withInterceptors([appCoreInterceptor]))),
  ]
};
