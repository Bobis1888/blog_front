import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CoreModule} from 'app/core/core.module';
import {HasErrors} from "app/core/abstract/has-errors";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute, Router} from "@angular/router";
import {Article, ContentService, Filter} from "app/core/service/content/content.service";
import {takeUntil} from "rxjs";
import {animations} from "app/core/config/app.animations";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'search',
  standalone: true,
  animations: animations,
  imports: [CoreModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent extends HasErrors implements OnInit {

  constructor(translate: TranslateService,
              private aRouter: ActivatedRoute,
              private router: Router,
              private title: Title,
              private meta: Meta,
              private contentService: ContentService,
              private deviceService: DeviceDetectorService) {
    super(translate);
  }

  protected state: 'loading' | 'data' | 'empty' | 'init' = 'init';
  protected items: Array<Article> = [];
  protected byTag: boolean = false;
  protected byAuthor: boolean = false;

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup.addControl('search', new FormControl('', []));
    let q = this.aRouter.snapshot.queryParamMap?.get("q");
    this.byTag = this.aRouter.snapshot.queryParamMap?.get("tag") == 'true';
    this.byAuthor = this.aRouter.snapshot.queryParamMap?.get("author") == 'true';
    this.title.setTitle(this.byTag ? "Tag: " + q : this.byAuthor ? "Author: " + q : "Search");
    this.meta.updateTag({name: 'description', content: 'Search results for: ' + q});

    (this.formGroup.get('search') as FormControl).valueChanges
      .pipe(takeUntil(this.unSubscriber))
      .subscribe((it) => {
        this.byTag = it.indexOf('#') == 0;
        this.byAuthor = it.indexOf('@') == 0;
      });

    if (this.byTag) {
      q = "#" + q;
    }

    if (q) {
      this.formGroup.get("search")?.setValue(q);
      this.submit();
    }
  }

  public submit(): void {
    let query = this.formGroup.get("search")?.value;
    this.router.navigate([], {
      queryParams: {q: query || null},
      queryParamsHandling: 'merge',
    });

    if (!query || this.state == 'loading' || query.length < 3) {
      return;
    }

    this.state = 'loading';
    this.items = [];

    this.contentService.list({
      max: 10,
      page: 0,
      search: {
        query: query,
        author: this.byAuthor ? query : null,
        tags: this.byTag ? [query] : null
      }
    } as Filter)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.items.push(...it);

          if (this.items.length == 0) {
            this.state = 'empty';
          } else {
            this.state = 'data';
          }
        },
        error: err => {
          this.state = 'empty';
        }
      });
  }

  public goToView(item: Article) {
    this.router.navigate(['/article/view', item.id]).then();
  }
}
