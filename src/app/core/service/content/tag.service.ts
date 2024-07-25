import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {map, Observable} from "rxjs";

export interface Tag {
  value: string;
  count: number;
}

export interface TagsFilter {
  max: number;
  query: string;
}

@Injectable({
  providedIn: 'any'
})
export class TagService {

  constructor(private httpSender: HttpSenderService) {
  }

  list(filter: TagsFilter): Observable<Array<Tag>> {
    return this.httpSender.send(HttpMethod.POST, '/content/tag/list', filter)
      .pipe(map(it => it.list));
  }

  suggestions(): Observable<Array<Tag>> {
    return this.httpSender.send(HttpMethod.GET, '/content/tag/suggestions')
      .pipe(map(it => it.list));
  }
}
