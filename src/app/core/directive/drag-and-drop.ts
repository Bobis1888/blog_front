import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  standalone: true,
  selector: '[dragAndDrop]'
})
export class DragAndDropDirective {

  @Output() fileDropped = new EventEmitter<File>();

  constructor() {}

  @HostListener('drop', ['$event'])
  onDrop($event: any) {
    $event.preventDefault();

    const transfer = $event.dataTransfer;
    this.fileDropped.emit(transfer.files[0]);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: any) {
    $event.preventDefault();
  }
}
