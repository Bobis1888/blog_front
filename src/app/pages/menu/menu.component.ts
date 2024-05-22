import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RootModule} from "app/root.module";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {AuthService, AuthState} from "app/core/service/auth/auth.service";
import {takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [RootModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less',
})
export class MenuComponent extends UnSubscriber implements OnInit {

  protected readonly AuthState = AuthState;
  protected authState: AuthState = AuthState.unauthorized;

  constructor(protected authService: AuthService, protected router: Router) {
    super();
  }

  ngOnInit(): void {
    // this.checkState();
  }

  checkState() {
    this.authService.getState()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((res) => {
      });
  }

  logout() {
    this.authService.logout()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(it => {

        this.router.navigate(["/"]);
        return;
      });
  }

  protected readonly AuthService = AuthService;
}
