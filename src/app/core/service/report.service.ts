import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "./base/http-sender.service";
import {Observable} from "rxjs";

export interface ReportDto {
  type: string;
  articleId: string;
  description: string;
}

@Injectable({
  providedIn: 'any'
})
export class ReportService {

  constructor(private httpSender: HttpSenderService) {
  }

  report(report: ReportDto): Observable<void> {
    return this.httpSender.send(HttpMethod.POST, '/user/report', report);
  }
}
