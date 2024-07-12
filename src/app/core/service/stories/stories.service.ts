import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable} from "rxjs";
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
    return this.httpSender.send(HttpMethod.GET, '/stories/list?lang=' + this.lang);
  }
}
