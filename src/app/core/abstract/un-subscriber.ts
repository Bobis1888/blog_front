import {Subject} from "rxjs";
import {Component, inject, OnDestroy} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({template: ''})
export abstract class UnSubscriber implements OnDestroy {

  protected title: Title;
  protected translate: TranslateService;

  protected constructor() {
    this.title = inject(Title);
    this.translate = inject(TranslateService);
  }

  protected unSubscriber: Subject<any> = new Subject();

  ngOnDestroy(): void {
    this.translate.get('meta.title').subscribe({
      next: (it) => this.title.setTitle(it),
    });
    this.unSubscriber.next(null);
    this.unSubscriber.complete();
  }
}
