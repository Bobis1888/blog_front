import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable} from "rxjs";

export enum Type {
  COMMENT,
  LIKE,
  SUBSCRIBE,
  REPORT
}

export interface Notification {
  id: string;
  createdDate: Date;
  type: Type;
  payload: Map<string, string>;
  isRead: boolean;
}

export interface NotificationList {
  list: Array<Notification>;
  totalPages: number;
}

@Injectable({
  providedIn: 'any'
})
export class NotificationService {

  constructor(private httpSender: HttpSenderService) {
  }

  countUnread(): Observable<number> {
    return this.httpSender.send(HttpMethod.GET, '/notification/count_unread');
  }

  list(max: number, page: number): Observable<NotificationList> {
    return this.httpSender.send(HttpMethod.POST, '/notification/list', {max, page})
  }

  read(id: string): Observable<any> {
    return this.httpSender.send(HttpMethod.POST, '/notification/read/' + id);
  }

  readAll(): Observable<void> {
    return this.httpSender.send(HttpMethod.POST, '/notification/read_all');
  }
}
