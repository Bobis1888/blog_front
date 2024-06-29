import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "../base/http-sender.service";
import {Observable} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";
import {Filter} from "app/core/service/content/content.service";

interface SubscriptionListResponse {
  list: Array<Subscription>
  totalPages: number
}

interface Subscription {
  nickname: string
  subscribedDate: Date
}

@Injectable({
  providedIn: 'any'
})
export class SubscriptionService {

  constructor(private httpSender: HttpSenderService) {}

  subscribe(authorName: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.PUT, '/content/subscribe/' + authorName);
  }

  unsubscribe(authorName: any): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/unsubscribe/' + authorName);
  }

  subscribers(filter: Filter): Observable<SubscriptionListResponse> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/subscribers', filter);
  }

  subscriptions(filter: Filter): Observable<SubscriptionListResponse> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/subscriptions', filter);
  }
}
