import {Component, OnInit} from '@angular/core';
import {Article, ContentService} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {takeUntil} from "rxjs";
import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'view-article',
  standalone: true,
  imports: [RootModule],
  templateUrl: './view-article.component.html',
  styleUrl: './view-article.component.less'
})
export class ViewArticleComponent extends UnSubscriber implements OnInit {

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

    if (!id) {
      id = this.aRouter.snapshot.params['id'];
    }

    if (id == null || id == '') {
      this.state = 'empty';
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
