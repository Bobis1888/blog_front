import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RootModule} from "app/root.module";
import {MenuComponent} from "app/pages/menu/menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RootModule, RouterOutlet, MenuComponent],
  templateUrl: 'main.component.html',
})
export class MainComponent {}
