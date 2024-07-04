import {Injectable} from "@angular/core";
import {map, Observable, of, takeUntil, tap} from "rxjs";
import {SuccessDto} from "src/app/core/dto/success-dto";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {Router} from "@angular/router";
import {UserInfo} from "app/core/service/auth/user-info";

export enum AuthState {
  authorized = 'authorized',
  unauthorized = 'unauthorized',
}

//TODO split to 2 service
@Injectable({
  providedIn: 'any'
})
export class AuthService extends UnSubscriber {

  get isAuthorized(): boolean {
    let state = AuthState.unauthorized;

    if (localStorage.getItem('authState')) {
      state = localStorage.getItem('authState') as AuthState
    }

    return state == AuthState.authorized;
  }

  get userInfo(): UserInfo {
    let info = localStorage.getItem('cachedUserInfo');

    if (info != null) {
      try {
        return JSON.parse(localStorage.getItem('cachedUserInfo')!) as UserInfo;
      } catch (e) {
        return {} as UserInfo;
      }
    }

    return {} as UserInfo;
  }

  set userInfo(it: UserInfo | null) {
    if (it) {
      localStorage.setItem('cachedUserInfo', JSON.stringify(it));
    }
  }

  get authState(): AuthState {
    return this.isAuthorized ? AuthState.authorized : AuthState.unauthorized
  }

  constructor(private httpSender: HttpSenderService, private router: Router) {
    super();
    try {
      this.getState()
        .pipe(takeUntil(this.unSubscriber))
        .subscribe();
    } catch (ignore) {}
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
          } else {

            if (this.isAuthorized) {
              this.changeAuthState(AuthState.unauthorized);
              this.router.navigate(['/'], {
                queryParams: {expired: true}
              }).then();
            }
          }

          return res;
        })
      );
  }

  public logout(): Observable<void> {
    return this.httpSender.send(HttpMethod.GET, '/auth/logout')
      .pipe(map(()=> {
        localStorage.removeItem("cachedUserInfo");
        this.changeAuthState(AuthState.unauthorized);
      }));
  }

  public resetPassword(email: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.GET, '/auth/reset-password?email=' + email);
  }

  public changePassword(password: string, uuid: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/change-password', {uuid, password});
  }

  public changeNickname(nickname: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/change-nickname', {nickname});
  }

  public changeDescription(description: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/auth/change-description', {description});
  }

  public info(force: boolean = false, nickname: string = ''): Observable<UserInfo> {

    if (nickname) {
      nickname = '/' + nickname;
    }

    if (force || this.userInfo == null || nickname) {
      return this.httpSender.send(HttpMethod.GET, '/auth/info' + nickname)
        .pipe(
          tap((it: UserInfo) => {
            if (!nickname) {
              it.hasImage = true;
              it.imagePath = "/api/storage/download?type=avatar&nickname=" + it.nickname + "&uuid=";
              this.userInfo = it;
            }
          })
        );
    }

    return of(this.userInfo);
  }

  private changeAuthState(authState: AuthState) {
    localStorage.setItem('authState', authState);
  }
}
