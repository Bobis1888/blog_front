import {Injectable, OnInit} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SenderService implements OnInit {

  protected options: any = {};

  constructor(protected httpClient: HttpClient) {
  }

  ngOnInit(): void {
    let defaultHeaders = new HttpHeaders();
    defaultHeaders.append('Content-Type', 'application/json');
    this.options = {headers: defaultHeaders, withCredentials: true};
  }


}
