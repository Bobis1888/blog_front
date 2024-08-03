import {Component, Input} from '@angular/core';
import {Editor} from 'ngx-editor';
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'emoji-menu',
  templateUrl: './emoji-menu.component.html',
  styleUrls: ['./emoji-menu.component.less'],
  imports: [
    NgClass,
    TranslateModule,
    MatIcon,
    PickerComponent,
    MatMenu,
    MatMenuTrigger,
    MatIconButton
  ],
  standalone: true
})
export class EmojiMenuComponent {

  @Input() editor!: Editor;

  constructor() {
  }

  click($event: any): void {

    if (!$event) {
      return;
    }

    this.editor
      .commands
      .insertText($event.emoji.native)
      .exec();
  }
}
