import {Injectable} from "@angular/core";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {map, Observable, of} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";
import {Article} from "app/core/service/content/article";

export enum Status {
  published = 'published',
  draft = 'draft',
  pending = 'pending'
}

export interface TagsFilter {
  max: number;
  page: number
  sortBy: Array<string>;
  direction: string;
  query: string;
}

export interface Filter {
  max: number;
  page: number
  sortBy: Array<string>;
  direction: string;
  search: Search;
}

export interface Search {
  query: string;
  author: string;
  tags: Array<string>;
}

export interface ListResponse {
  list: Array<Article>;
  totalPages: number;
}

export interface ChangePreviewRequest {
  content: string;
}

@Injectable({
  providedIn: 'any'
})
export class ContentService extends UnSubscriber {

  constructor(private httpSender: HttpSenderService) {
    super();
  }

  get(id: string): Observable<Article> {
    return this.httpSender.send(HttpMethod.GET, '/content/get/' + id);
  }

  save(article: Article): Observable<{ success: true, id: string }> {
    return this.httpSender.send(HttpMethod.POST, '/content/save', article);
  }

  delete(id: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/delete/' + id);
  }

  list(filter: Filter): Observable<Article[]> {
    return this.httpSender.send(HttpMethod.POST, '/content/list', filter)
      .pipe(map(it => it.list));
  }

  tags(filter: TagsFilter): Observable<Array<string>> {
    return this.httpSender.send(HttpMethod.POST, '/content/tags', filter)
      .pipe(map(it => it.list));
  }

  //TODO
  getTrends(): Observable<Article[]> {
    return this.httpSender.send(HttpMethod.POST, '/content/list', {
      max: 10,
      page: 0,
    } as Filter)
      .pipe(map(it => it.list));
  }

  saveToBookmarks(id: string) {
    return this.httpSender.send(HttpMethod.PUT, '/content/bookmark/' + id);
  }

  removeFromBookmarks(id: string) {
    return this.httpSender.send(HttpMethod.DELETE, '/content/bookmark/' + id);
  }

  like(id: string) {
    return this.httpSender.send(HttpMethod.PUT, '/content/like/' + id);
  }

  dislike(id: string) {
    return this.httpSender.send(HttpMethod.DELETE, '/content/like/' + id);
  }

  changeStatus(id: string, status: Status): Observable<SuccessDto> {

    if (!id || !status) {
      return of({success: false});
    }

    return this.httpSender.send(HttpMethod.POST, '/content/change-status/' + id, {status: status.toUpperCase()});
  }

  bookmarks(filter: Filter): Observable<Article[]> {
    return this.httpSender.send(HttpMethod.POST, '/content/bookmarks', filter).pipe(
      map(it => it.list)
    );
  }

  changePreview(id: string, body: ChangePreviewRequest): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.PUT, '/content/preview/' + id, body);
  }
}
