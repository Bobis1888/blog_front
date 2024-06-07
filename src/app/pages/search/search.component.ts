import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RootModule} from 'app/root.module';
import {HasErrors} from "app/core/abstract/has-errors";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute, Router} from "@angular/router";
import {Article, ContentService, Filter} from "app/core/service/content/content.service";
import {delay, takeUntil} from "rxjs";

@Component({
  selector: 'search',
  standalone: true,
  imports: [RootModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent extends HasErrors implements OnInit {

  constructor(translate: TranslateService,
              private aRouter: ActivatedRoute,
              private router: Router,
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
      query: query
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
    this.router.navigate(['/article/view', item.id]);
  }
}
