import {TranslateLoader} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateModuleConfig} from "@ngx-translate/core/dist/public-api";

// https://github.com/ngx-translate/core
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/l10n/', '.json');
}

export const provideTranslation = (): TranslateModuleConfig => ({
  useDefaultLang: true,
  defaultLanguage: localStorage.getItem('currentLanguage') ?? "en",
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
});
