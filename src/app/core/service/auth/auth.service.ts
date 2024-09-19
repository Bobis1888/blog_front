import {EventEmitter, Injectable} from '@angular/core';
import {map, Observable, of, tap} from 'rxjs';
import {SuccessDto} from 'app/core/dto/success-dto';
import {
  HttpMethod,
  HttpSenderService,
} from 'app/core/service/base/http-sender.service';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {Router} from '@angular/router';
import {UserInfo} from 'app/core/service/auth/user-info';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

export enum AuthState {
  authorized = 'authorized',
  unauthorized = 'unauthorized',
}

//TODO split to 2 service
@Injectable({
  providedIn: 'any',
})
export class AuthService extends UnSubscriber {
  private ref: MatSnackBarRef<any> | null = null;
  static infoChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  get isAuthorized(): boolean {
    let state = AuthState.unauthorized;

    if (localStorage.getItem('authState')) {
      state = localStorage.getItem('authState') as AuthState;
    }

    return state == AuthState.authorized;
  }

  get userInfo(): UserInfo {
    let info = localStorage.getItem('cachedUserInfo');

    if (info != null) {
      try {
        return JSON.parse(info!) as UserInfo;
      } catch (e) {
        return {} as UserInfo;
      }
    }

    return {} as UserInfo;
  }

  set userInfo(it: UserInfo | null) {

    if (it) {
      localStorage.setItem('cachedUserInfo', JSON.stringify(it));
      AuthService.infoChanged.emit(true);
    }
  }

  get authState(): AuthState {
    return this.isAuthorized ? AuthState.authorized : AuthState.unauthorized;
  }

  constructor(
    private httpSender: HttpSenderService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {
    super();
  }

  public login(login: string, password: string): Observable<SuccessDto> {
    return this.httpSender
      .send(HttpMethod.POST, '/user/auth/login', {login, password})
      .pipe(
        map((it) => {
          if (it.success) {
            this.changeAuthState(AuthState.authorized);
          }

          return it;
        }),
      );
  }

  public registration(email: any, password: any): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/user/auth/registration', {
      email,
      password,
    });
  }

  public getState(): Observable<{ logged: boolean }> {
    return this.httpSender.send(HttpMethod.GET, '/user/state').pipe(
      map((res: { logged: boolean }) => {
        if (res.logged) {
          this.changeAuthState(AuthState.authorized);
        } else if (this.isAuthorized) {
          this.cleanAuthentication();
        }
        return res;
      }),
    );
  }

  private cleanAuthentication() {
    this.changeAuthState(AuthState.unauthorized);
    this.ref?.dismiss();
    this.ref = this.matSnackBar.open(
      this.translate.instant('errors.sessionExpired'),
      undefined,
      {duration: 3000, panelClass: 'snack-bar'},
    );

    if (this.router.url.includes('profile')) {
      this.router.navigate(['/top']).then();
    }

    localStorage.removeItem('cachedUserInfo');
  }

  public logout(): Observable<void> {
    return this.httpSender.send(HttpMethod.GET, '/user/auth/logout').pipe(
      map(() => {
        localStorage.removeItem('cachedUserInfo');
        this.changeAuthState(AuthState.unauthorized);
      }),
    );
  }

  public resetPassword(email: string): Observable<SuccessDto> {
    return this.httpSender.send(
      HttpMethod.GET,
      '/user/auth/reset-password?email=' + email,
    );
  }

  public changePassword(
    password: string,
    uuid: string,
  ): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/user/auth/change-password', {
      uuid,
      password,
    });
  }

  public changeNickname(nickname: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/user/change-nickname', {
      nickname,
    });
  }

  public changeDescription(description: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/user/change-description', {
      description,
    });
  }

  public changeImagePath(imagePath: string): Observable<SuccessDto> {
    return this.httpSender.send(HttpMethod.POST, '/user/change-image-path', {
      imagePath,
    });
  }

  public info(
    force: boolean = false
  ): Observable<UserInfo> {

    if (force || this.userInfo.nickname == null) {
      return this.httpSender.send(HttpMethod.GET, '/user/info').pipe(
        tap((it: UserInfo) => {
          it.hasImage = it.imagePath != null;
          this.userInfo = it;
        }),
      );
    }

    return of(this.userInfo);
  }

  public listInfo(nickname: string): Observable<Array<UserInfo>> {
    return this.httpSender.send(HttpMethod.GET, '/user/info/' + nickname)
      .pipe(
        tap((it: Array<UserInfo>) => it.forEach((info: UserInfo) => info.hasImage = info.imagePath != null)),
      );
  }

  public publicInfo(id: number): Observable<UserInfo> {
    return this.httpSender.send(HttpMethod.GET, '/user/public_info/' + id).pipe(
      tap((info: UserInfo) => info.hasImage = info.imagePath != null)
    );
  }

  private changeAuthState(authState: AuthState) {
    localStorage.setItem('authState', authState);
  }
}
