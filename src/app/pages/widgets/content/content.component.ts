import {Component, Input, OnInit} from '@angular/core';
import {animations} from "app/core/config/app.animations";
import {CoreModule} from "app/core/core.module";
import {Content} from "app/core/service/content/content";
import {LineType} from "../../../core/service/line/line.service";
import {Status} from "../../../core/service/content/content.service";

@Component({
  selector: 'content-widget',
  standalone: true,
  imports: [CoreModule],
  animations: animations,
  templateUrl: './content.component.html',
  styleUrl: './content.component.less',
})
export class ContentComponent implements OnInit {

  @Input()
  public item!: Content;

  ngOnInit(): void {}

  protected readonly LineType = LineType;
  protected readonly Status = Status;
}
