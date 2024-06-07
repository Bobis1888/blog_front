import { Injectable } from "@angular/core";
import { UnSubscriber } from "app/core/abstract/un-subscriber";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {map, Observable} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";


export class Article {
  id: string;
  title: string;
  preView: string;
  preViewImg: string;
  content: string;
  authorName: string;
  publishedDate: Date;

  constructor(id: string, title: string, preView: string, preViewImg: string, content: string, author: string, date: Date) {
    this.id = id;
    this.title = title;
    this.preView = preView;
    this.preViewImg = preViewImg;
    this.content = content;
    this.authorName = author;
    this.publishedDate = date;
  }
}

export interface Filter {
  max: number;
  page: number
  query: string;
  sortBy: Array<string>;
  direction: string;
}

@Injectable()
export class ContentService extends UnSubscriber {

  constructor(private httpSender: HttpSenderService) {
    super();
  }

  get(id: string): Observable<Article> {
    return this.httpSender.send(HttpMethod.GET, '/content/get/' + id);
  }

  save(article: Article): Observable<{success: true, id: number}> {
    return this.httpSender.send(HttpMethod.POST, '/content/save', article);
  }

  delete(id: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/delete/' + id);
  }

  list(filter: Filter): Observable<Article[]> {
    return this.httpSender.send(HttpMethod.POST, '/content/list', filter)
      .pipe(map(it => it.list));
  }

  tags(filter: Filter): Observable<string[]> {
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
}
