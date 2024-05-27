import {Subject} from "rxjs";
import {Component, OnDestroy} from "@angular/core";

@Component({template: ''})
export abstract class UnSubscriber implements OnDestroy {

  protected unSubscriber: Subject<any> = new Subject();

  ngOnDestroy(): void {
    this.unSubscriber.next(null);
    this.unSubscriber.complete();
  }
}
