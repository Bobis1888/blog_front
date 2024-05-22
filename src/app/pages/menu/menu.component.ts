import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from "app/root.module";
import {UnSubscriber} from "app/abstract/un-subscriber";
import {AuthService} from "app/core/service/auth/auth.service";


@Component({
  selector: 'summary',
  standalone: true,
  imports: [RootModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.less'
})
export class SummaryComponent extends UnSubscriber implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
    super();
  }

  ngOnInit(): void {

  }
}
