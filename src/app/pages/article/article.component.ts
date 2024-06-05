import {Component, OnInit} from '@angular/core';
import {Article, ContentService} from "app/core/service/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RootModule} from "app/root.module";
import {delay, takeUntil} from "rxjs";
import {UnSubscriber} from "app/core/abstract/un-subscriber";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'article',
  standalone: true,
  imports: [RootModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.less'
})
export class ArticleComponent extends UnSubscriber implements OnInit {

  protected content: Article = {} as Article;
  protected state: 'data' | 'loading' | 'empty' = 'loading';

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private router: Router,
              private aRouter: ActivatedRoute) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    let id = this.aRouter.snapshot.queryParamMap?.get("id");

    if (id == null || id == '') {
      return;
    }

    this.contentService.get(id)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.content = it;
          this.state = 'data';
        },
        error: err => {
          this.state = 'empty';
        }
      });
  }

  public goToUser(userName: string): void {

    if (!userName) {
      return;
    }

    this.router.navigate(['/search'], {queryParams: {q: userName, author: true}});
  }
}
