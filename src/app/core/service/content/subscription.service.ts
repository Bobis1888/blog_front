import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "../base/http-sender.service";
import {Observable} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";

export interface SubscriptionListResponse {
  list: Array<Subscription>;
  totalPages: number;
  totalRows: number;
}

export interface ActionsListResponse {
  list: Array<SubscriptionActions>;
  // totalPages: number;
  // totalRows: number;
}

export interface SubscriptionActions {
  userId: number;
  canSubscribe: boolean;
  canUnsubscribe: boolean;
}

export interface Subscription {
  nickname: string;
  subscribedDate: Date;
}

export enum Type {
  SUBSCRIPTION = 'SUBSCRIPTION',
  SUBSCRIBERS = 'SUBSCRIBERS'
}

export interface Filter {
  type: Type;
  max: number;
  page: number;
  sortBy: Array<string>;
  direction: "ASC" | "DESC";
  query: string;
}

@Injectable({
  providedIn: 'any'
})
export class SubscriptionService {

  constructor(private httpSender: HttpSenderService) {
  }

  subscribe(authorName: number): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.PUT, '/subscription/subscribe/' + authorName);
  }

  unsubscribe(authorName: number): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.DELETE, '/subscription/unsubscribe/' + authorName);
  }

  list(filter: Filter): Observable<SubscriptionListResponse> {
    return this.httpSender.send(HttpMethod.POST, '/subscription/list', filter);
  }

  actions(userIds: Array<number>): Observable<ActionsListResponse> {
    return this.httpSender.send(HttpMethod.GET, '/subscription/actions?userIds=' + userIds.join(','));
  }
}
