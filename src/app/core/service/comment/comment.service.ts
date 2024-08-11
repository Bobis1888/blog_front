import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable} from "rxjs";
import {CommentList} from "app/core/service/comment/comment";

export interface Filter {
  contentId: string;
  page: number;
  max: number;
}

@Injectable({
  providedIn: 'any',
})
export class CommentService {

  constructor(private httpSender: HttpSenderService) {
  }

  public save(contentId: string, comment: string): Observable<{ success: true }> {
    return this.httpSender.send(HttpMethod.POST, '/content/comment/save', {
      "contentId": contentId,
      "comment": comment
    });
  }

  public list(filter: Filter): Observable<CommentList> {
    return this.httpSender.send(HttpMethod.POST, '/content/comment/list', filter);
  }

  public vote(commentId: string, value: boolean): Observable<void> {
    return this.httpSender.send(HttpMethod.POST, '/content/comment/vote', {
      "commentId": commentId,
      "value": value
    });
  }
}
