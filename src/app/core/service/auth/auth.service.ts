import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SuccessDto} from "src/app/core/dto/success-dto";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";

@Injectable()
export class LoginService {
  constructor(private httpSender: HttpSenderService) {
  }

  public login(login: string, password: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/login', {login, password});
  }
}
