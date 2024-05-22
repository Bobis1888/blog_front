import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {RootModule} from "src/app/root.module";

@Component({
  selector: 'after-registration',
  standalone: true,
  imports: [RootModule],
  templateUrl: './after-registration.component.html',
  styleUrl: './after-registration.component.less'
})
export class AfterRegistrationComponent {

  state: string = "loading";

  constructor(private router: Router) {}
}
