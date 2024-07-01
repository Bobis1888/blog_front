import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable} from "rxjs";
import {Statistics} from "./statistics";

@Injectable({
  providedIn: 'any'
})
export class StatisticsService {

  constructor(private httpSender: HttpSenderService) {}

  get(nickname: string = ''): Observable<Statistics> {

    if (nickname) {
      nickname = '/' + nickname;
    }

    return this.httpSender.send(HttpMethod.GET, '/content/statistics' + nickname);
  }
}
