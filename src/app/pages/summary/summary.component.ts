import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {RootModule} from "app/root.module";
import {AuthService} from "app/core/service/auth/auth.service";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {takeUntil} from "rxjs";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RootModule, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent extends UnSubscriber implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.authService.state()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe();
  }
}
