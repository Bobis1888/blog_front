import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from 'app/root.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {Article, ContentService} from "app/core/service/content/content.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'trends',
  standalone: true,
  imports: [RootModule],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.less',
})
export class TrendsComponent extends UnSubscriber implements OnInit {

  protected state: 'loading' | 'data' = 'loading';

  constructor(
    private router: Router,
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
          this.state = 'data';
        }
      });
  }

  public goToUser(userName: string): void {

    if (!userName) {
      return;
    }

    this.router.navigate(['/search'], {queryParams: {q: userName, author: true}});
  }

  public goToView(item: Article) {
    this.router.navigate(['/article/view', item.id]);
  }
}
