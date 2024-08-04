import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable, of} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

export interface Story {
  id: number;
  title: string;
  description: string;
  link: string;
  lang: string;
}

@Injectable({
  providedIn: 'any'
})
export class StoriesService {

  constructor(
    private httpSender: HttpSenderService,
    private translateService: TranslateService
  ) {
  }

  get lang(): string {
    return this.translateService.getDefaultLang();
  }

  get current(): number {
    let storyId = localStorage.getItem('storyId');

    if (storyId != null) {
      try {
        return Number.parseInt(storyId);
      } catch (ignore) {
      }
    }

    return -1;
  }

  set current(id: number) {
    localStorage.setItem('storyId', id.toString());
  }

  public list(): Observable<Array<Story>> {
    return of([
      {
        id: 1,
        title: 'Новый евент',
        description: 'Пиши на заданные темы и поделись с друзьями',
        link: 'event',
        lang: 'ru'
      },
      {
        id: 2,
        title: 'Новый функционал',
        description: 'Публикуем описание нового функционала',
        link: 'features',
        lang: 'ru'
      }
    ])
    // return this.httpSender.send(HttpMethod.GET, '/stories/list?lang=' + this.lang);
  }
}
