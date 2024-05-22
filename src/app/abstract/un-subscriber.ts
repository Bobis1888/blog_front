import {Subject} from "rxjs";
import {OnDestroy} from "@angular/core";

export abstract class Unsubscribe implements OnDestroy {

  protected unSubscriber: Subject<any> = new Subject();

  ngOnDestroy(): void {
    this.unSubscriber.next(null);
    this.unSubscriber.complete();
  }
}
