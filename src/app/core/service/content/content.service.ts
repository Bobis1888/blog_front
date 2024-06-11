import {Injectable} from "@angular/core";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {map, Observable, of} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";

export enum Status {
  published = 'published',
  draft = 'draft',
  pending = 'pending'
}

export class Article {
  id: string;
  title: string;
  preView: string;
  preViewImg: string;
  content: string;
  tags: Array<string> = [];
  authorName: string;
  status: Status = Status.draft;
  publishedDate: Date;
  isFavorite: boolean = false;
  isLiked: boolean = false;

  constructor(id: string,
              title: string,
              preView: string,
              preViewImg: string,
              content: string,
              author: string,
              date: Date,
              tags: Array<string>,
              status: Status,
              isFavorite: boolean,
              isLiked: boolean) {
    this.id = id;
    this.title = title;
    this.preView = preView;
    this.preViewImg = preViewImg;
    this.content = content;
    this.authorName = author;
    this.publishedDate = date;
    this.tags = tags ?? [];
    this.isFavorite = isFavorite;
    this.isLiked = isLiked;
    this.status = status;
  }
}

export interface Filter {
  max: number;
  page: number
  query: string;
  sortBy: Array<string>;
  direction: string;
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

  tags(filter: Filter): Observable<Array<string>> {
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

  saveToBookmark(id: string) {
    return this.httpSender.send(HttpMethod.POST, '/content/save-to-bookmark', {id});
  }

  like(id: string) {
    return this.httpSender.send(HttpMethod.POST, '/content/like', {id});
  }

  changeStatus(id: string, status: Status): Observable<SuccessDto> {

    if (!id || !status) {
      return of({success: false});
    }

    return this.httpSender.send(HttpMethod.POST, '/content/change-status/' + id, {status: status.toUpperCase()});
  }
}
