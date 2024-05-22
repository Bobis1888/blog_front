import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {RootModule} from "src/app/root.module";

@Component({
  selector: 'confirm-registration',
  standalone: true,
  imports: [RootModule],
  templateUrl: './confirm-registration.component.html',
  styleUrl: './confirm-registration.component.less'
})
export class ConfirmRegistrationComponent {

  state: string = "loading";

  constructor(private router: Router) {}
}
