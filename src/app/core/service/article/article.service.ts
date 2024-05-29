import { Injectable } from "@angular/core";
import { UnSubscriber } from "app/core/abstract/un-subscriber";
import { HttpSenderService } from "app/core/service/base/http-sender.service";


export class Article {
  id: string;
  title: string;
  preView: string;
  preViewImg: string;
  author: string;

  constructor(id: string, title: string, preView: string, preViewImg: string, author: string) {
    this.id = id;
    this.title = title;
    this.preView = preView;
    this.preViewImg = preViewImg;
    this.author = author;
  }
}

@Injectable()
export class ArticleService extends UnSubscriber {

  constructor(private httpSender: HttpSenderService) {
    super();
  }
}
