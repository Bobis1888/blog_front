import {Component, OnInit} from '@angular/core';
import {UnSubscriber} from 'src/app/core/abstract/un-subscriber';
import {Article, ContentService} from "src/app/core/service/content/content.service";
import {takeUntil} from "rxjs";
import {animations} from "src/app/core/config/app.animations";
import {CoreModule} from "src/app/core/core.module";

@Component({
  selector: 'trends',
  standalone: true,
  imports: [CoreModule],
  animations: animations,
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.less',
})
export class TrendsComponent extends UnSubscriber implements OnInit {

  protected state: 'loading' | 'data' | 'empty' = 'loading';

  constructor(
    private articleService: ContentService
  ) {
    super();
  }

  public items: Array<Article> = [];

  ngOnInit(): void {
    this.articleService
      .getTrends()
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.items.push(...it);
          this.state = 'data';
        },
        error: err => {
          this.state = 'empty';
        }
      });
  }
}
