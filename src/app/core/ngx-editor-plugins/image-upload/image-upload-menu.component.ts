import {Component, Input, OnInit} from '@angular/core';
import {setBlockType} from 'prosemirror-commands';
import {EditorState, Plugin, PluginKey, Transaction} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Editor} from 'ngx-editor';
import {isNodeActive} from 'ngx-editor/helpers';
import {NgClass} from "@angular/common";
import {DragAndDropDirective} from "app/core/directive/drag-and-drop";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'image-upload-menu',
  templateUrl: './image-upload-menu.component.html',
  styleUrls: ['./image-upload-menu.component.less'],
  imports: [
    NgClass,
    DragAndDropDirective,
    TranslateModule,
    MatIcon
  ],
  standalone: true
})
export class ImageUploadMenuComponent implements OnInit {
  private file: File | null = null;
  private maxSize: number = 1;

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {
  }

  @Input() editor!: Editor;
  isActive = false;
  isDisabled = false;

  get accept(): string {
    return "image/png, image/jpeg, image/gif, image/webp, image/jpg";
  }

  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const {schema} = state;

    if (this.isActive) {
      return setBlockType(schema.nodes['paragraph'])(state, dispatch);
    }

    return setBlockType(schema.nodes['code_mirror'])(state, dispatch);
  }

  update = (view: EditorView) => {
    const {state} = view;
    const {schema} = state;
    this.isActive = isNodeActive(state, schema.nodes['code_mirror']);
    this.isDisabled = !this.execute(state); // returns true if executable
  };

  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-codemirror`),
      view: () => {
        return {
          update: this.update,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }

  handleFile($event: any) {
    this.file = null;

    if ($event instanceof File) {
      this.file = $event;
    } else if ($event.target?.files?.length > 0) {
      this.file = $event.target.files[0];
    }

    if ((this.file?.size ?? 0) > (this.maxSize * 1024 * 1024)) {
      this.file = null;
      let error = this.translate.instant('errors.image.maxSize', {maxSize: this.maxSize})
      this.snackBar.open(error, 'Ok', {duration: 5000})
    }

    if (this.file) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.file!);
      let me = this

      fileReader.onload = function () {
        let base64 = fileReader.result as string;
        let url = 'assets/images/dinosaur.png'; // ?? '/api/storage/download?';
        const {state, dispatch} = me.editor.view;
        const {schema} = state;

        // Create an image node
        const imageNode = schema.nodes['image'].create({src: base64});

        // Create a transaction to insert the image at the current selection
        const transaction = state.tr.insert(state.selection.$from.pos, imageNode);

        // Apply the transaction to the editor's state
        dispatch(transaction);
      };
    }
  }
}
