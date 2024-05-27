import {Injectable} from "@angular/core";
import {map, Observable, Subject} from "rxjs";
import {SuccessDto} from "src/app/core/dto/success-dto";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";

// TODO catch errors

export enum AuthState {
  authorized = 'authorized',
  unauthorized = 'unauthorized',
  not_confirmed = 'not_confirmed',
  error = 'error'
}

@Injectable()
export class AuthService {

  private static authState: AuthState = AuthState.unauthorized;

  get isAuthorized(): boolean {
    return AuthService.authState == AuthState.authorized;
  }

  constructor(private httpSender: HttpSenderService) {
    try {
      this.getState().subscribe();
    } catch (ignore) {
    }
  }

  public login(login: string, password: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/login', {login, password})
      .pipe(
        map((it) => {

          if (it.success) {
            this.changeAuthState(AuthState.authorized);
          }

          return it
        })
      );
  }

  public registration(email: any, password: any): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/registration', {email, password});
  }

  public getState(): Observable<{ 'logged': boolean }> {
    return this.httpSender.send(HttpMethod.GET, '/auth/state')
      .pipe(
        map(res => {

          if (res.logged) {
            this.changeAuthState(AuthState.authorized);
          }

          return res;
        })
      );
  }

  public logout(): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.GET, '/auth/logout')
      .pipe(map(res => {
        this.changeAuthState(AuthState.unauthorized);
        return {success: true} as SuccessDto;
      }));
  }

  public resetPassword(email: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.GET, '/auth/reset-password?email=' + email);
  }

  public changePassword(password: string, uuid: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/change-password', {uuid,password});
  }

  private changeAuthState(authState: AuthState) {
    AuthService.authState = authState;
  }
}
