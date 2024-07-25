import {Injectable} from "@angular/core";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {Observable, of} from "rxjs";
import {SuccessDto} from "app/core/dto/success-dto";
import {Content} from "app/core/service/content/content";

export enum Status {
  published = 'published',
  draft = 'draft',
  pending = 'pending'
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
  list: Array<Content>;
  totalPages: number;
  totalRows: number;
}

export interface ChangePreviewRequest {
  content: string;
}

@Injectable({
  providedIn: 'any'
})
export class ContentService {

  constructor(private httpSender: HttpSenderService) {}

  get(id: string): Observable<Content> {
    return this.httpSender.send(HttpMethod.GET, '/content/get/' + id);
  }

  getByLink(link: string): Observable<Content> {
    return this.httpSender.send(HttpMethod.GET, '/content/get-by-link/' + link);
  }

  save(content: Content): Observable<{ success: true, id: string }> {
    return this.httpSender.send(HttpMethod.POST, '/content/save', content);
  }

  delete(id: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.DELETE, '/content/delete/' + id);
  }

  list(filter: Filter): Observable<ListResponse> {
    return this.httpSender.send(HttpMethod.POST, '/content/list', filter);
  }

  getSuggestions(): Observable<ListResponse> {
    // TODO post
    // return this.httpSender.send(HttpMethod.POST, '/content/list', {
    //   max: 10,
    //   page: 0,
    // } as Filter);
    return this.httpSender.send(HttpMethod.GET, '/content/suggestions');
  }

  saveToBookmarks(id: string) {
    return this.httpSender.send(HttpMethod.PUT, '/content/bookmark/' + id);
  }

  removeFromBookmarks(id: string) {
    return this.httpSender.send(HttpMethod.DELETE, '/content/bookmark/' + id);
  }

  react(id: string, type: string) {
    return this.httpSender.send(HttpMethod.PUT, '/content/react/' + id + '/' + type);
  }

  removeReact(id: string) {
    return this.httpSender.send(HttpMethod.DELETE, '/content/react/' + id);
  }

  changeStatus(id: string, status: Status): Observable<SuccessDto> {

    if (!id || !status) {
      return of({success: false});
    }

    return this.httpSender.send(HttpMethod.POST, '/content/change-status/' + id, {status: status.toUpperCase()});
  }

  bookmarks(filter: Filter): Observable<ListResponse> {
    return this.httpSender.send(HttpMethod.POST, '/content/bookmarks', filter);
  }

  changePreview(id: string, body: ChangePreviewRequest): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.PUT, '/content/preview/' + id, body);
  }

  all(filter: Filter): Observable<ListResponse> {
    return this.httpSender.send(HttpMethod.POST, '/content/all', filter);
  }

  listFromAuthors(filter: Filter): Observable<ListResponse> {
    return this.httpSender.send(HttpMethod.POST, '/content/list-from-authors', filter);
  }
}
