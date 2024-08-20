import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CoreModule} from 'app/core/core.module';
import {HasErrors} from "app/core/abstract/has-errors";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute, EventType, Router} from "@angular/router";
import {ContentService, Filter} from "app/core/service/content/content.service";
import {catchError, debounceTime, distinctUntilChanged, map, mergeMap, of, takeUntil} from "rxjs";
import {Meta} from "@angular/platform-browser";
import {Content} from "app/core/service/content/content";
import {AdditionalInfo, UserInfo} from "app/core/service/auth/user-info";
import {AuthService} from "app/core/service/auth/auth.service";
import {StatisticsService} from "app/core/service/content/statistics.service";
import {SubscriptionService} from "app/core/service/content/subscription.service";
import {NgOptimizedImage} from "@angular/common";
import {Statistics} from "app/core/service/content/statistics";
import {Tag, TagService, TagsFilter} from "app/core/service/content/tag.service";
import {animations} from "app/core/config/app.animations";

@Component({
  selector: 'search',
  standalone: true,
  animations: animations,
  imports: [CoreModule, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent extends HasErrors implements OnInit {

  protected state: 'loading' | 'data' | 'empty' | 'init' = 'init';
  protected items: Array<Content> = [];
  protected byTag: boolean = false;
  protected byAuthor: boolean = false;
  protected authorInfos: Array<UserInfo> = [];
  protected loadMoreProgress: boolean = true;
  protected totalPages: number = 1;
  protected page: number = 0;
  protected tags: Array<Tag> = [];

  @ViewChild('focusField')
  protected focusField?: ElementRef<HTMLInputElement>;

  constructor(private aRouter: ActivatedRoute,
              private router: Router,
              private meta: Meta,
              private authService: AuthService,
              private statService: StatisticsService,
              private tagService: TagService,
              private subsService: SubscriptionService,
              private contentService: ContentService,
              private deviceService: DeviceDetectorService) {
    super();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get canLoadMore(): boolean {
    return this.totalPages > 1 && !this.loadMoreProgress && this.page < this.totalPages - 1;
  }

  registrationDate(authorInfo: UserInfo): number {

    if (!authorInfo?.registrationDate) {
      return 0;
    }

    let date = new Date(authorInfo.registrationDate);
    let oneDay = 24 * 60 * 60 * 1000;
    let diffInTime = date.valueOf() - Date.now().valueOf();

    return Math.abs(Math.round(diffInTime / oneDay));
  }

  get query(): string {
    let value = this.formGroup.get("search")?.value?.toString() ?? '';
    return (this.byAuthor || this.byTag) ? value.replaceAll(/ /g, '') : value;
  }

  canSubscribe(authorInfo: UserInfo): boolean {
    return this.authService.isAuthorized &&
      authorInfo?.statistics?.userIsSubscribed === false &&
      authorInfo?.nickname != this.authService.userInfo.nickname;
  }

  ngOnInit(): void {
    this.formGroup.addControl('search', new FormControl('', []));
    let q = this.aRouter.snapshot.queryParamMap?.get("q");
    this.byTag = this.aRouter.snapshot.queryParamMap?.get("tag") == 'true';
    this.byAuthor = this.aRouter.snapshot.queryParamMap?.get("author") == 'true';
    this.meta.updateTag({name: 'description', content: 'Search results for: ' + q, lang: 'en'});
    this.meta.updateTag({name: 'description', content: 'Результаты поиска: ' + q, lang: 'ru'});

    this.router.events
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: (it) => {

          if (it.type == EventType.NavigationSkipped || it.type == EventType.NavigationEnd && this.aRouter.snapshot.queryParamMap.get("q") == null) {
            this.page = 0;
            this.items = [];
            this.state = 'init';

            if (!this.query) {
              this.router.navigate([], {
                queryParams: {
                  q: null,
                  tag: null,
                  author: null
                },
                queryParamsHandling: 'merge',
              }).then();

              this.initState();
            }
          }
        }
      });

    (this.formGroup.get('search') as FormControl).valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unSubscriber)
      )
      .subscribe((it) => {
        this.byTag = it.indexOf('#') == 0;
        this.byAuthor = it.indexOf('@') == 0;

        if (it.length == 0) {
          this.page = 0;
          this.items = [];
          this.state = 'init';
          this.router.navigate([], {
            queryParams: {
              q: null,
              tag: null,
              author: null
            },
            queryParamsHandling: 'merge',
          }).then();
          this.initState();
        }
      });

    if (this.byTag) {

      if (q?.includes(',')) {
        q = q?.split(',').map(it => '#' + it).join(',');
      } else {
        q = "#" + q;
      }
    }

    if (this.byAuthor && !q?.startsWith('@')) {
      q = "@" + q;
    }

    if (q) {
      this.formGroup.get("search")?.setValue(q);
      this.submit();
    }

    this.translate.get('searchPage.metaTitle').subscribe({
      next: (it) => this.title.setTitle(it),
    });

    if (!q) {
      setTimeout(() => {
        if (this.focusField) {
          this.focusField?.nativeElement.focus()
        }
      }, 200);
    }

    this.initState();
  }

  public initState() {
    if (!this.query) {
      this.tagService
        .list({
          max: 35,
          query: ""
        } as TagsFilter)
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
          next: (it) => this.tags = it?.sort((a, b) => a.value.length - b.value.length)
        });
    }
  }

  public submit(): void {
    let query = this.query;

    this.router.navigate([], {
      queryParams: {
        q: this.formGroup.get("search")?.value?.replaceAll(/#/g, '').replaceAll(/ /g, '') || null,
        tag: this.byTag ? 'true' : null,
        author: this.byAuthor ? 'true' : null
      },
      queryParamsHandling: 'merge',
    }).then();

    if (this.focusField?.nativeElement) {
      this.focusField?.nativeElement.blur();
    }

    if (!query || this.state == 'loading' || query.length < 3) {
      return;
    }

    this.state = 'loading';
    this.items = [];

    if (this.byAuthor) {
      this.searchAuthors(query);
    }

    this.find(query);
  }

  public searchAuthors(nickname: string) {
    this.authorInfos = [];
    this.authService.infos(nickname)
      .pipe(
        takeUntil(this.unSubscriber),
        map(it => this.authorInfos = it),
        map(() => this.initAvatars()),
        mergeMap(() => this.initStats()),
        catchError((err) => of(err))
      )
      .subscribe({
        next: () => {

          if (this.authorInfos) {
            this.authorInfos.map(it => {
              it.additionalInfo = {} as AdditionalInfo;
              it.additionalInfo.canSubscribe = this.canSubscribe(it);
              it.additionalInfo.registrationDate = this.registrationDate(it);
              return it;
            })
          }
        },
      });
  }

  private initStats() {
    return this.statService.getList(this.authorInfos.map(it => it.nickname)).pipe(
      map(stat => {

        if (this.authorInfos) {
          return this.authorInfos.map(ui => {
            ui.statistics = stat?.find((it: Statistics) => it.nickname == ui.nickname) ?? null;
            return ui;
          });
        }

        return [];
      })
    )
  }

  private initAvatars(): void {

    if (this.authorInfos) {
      this.authorInfos.map(it => {
        it.hasImage = true;
        it.imagePath = "/api/storage/download?type=avatar&nickname=" + it.nickname + "&uuid=";
        return it;
      });
    }
  }

  public loadMore() {
    this.loadMoreProgress = true;
    this.page++;
    this.find(this.query);
  }

  private find(query: string = '') {
    this.contentService.list({
      max: 10,
      page: this.page,
      search: {
        query: query,
        author: this.byAuthor ? query : null,
        tags: this.byTag ? query?.split(',') : null
      }
    } as Filter)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: it => {
          this.items.push(...it.list);
          this.totalPages = it.totalPages;

          if (this.items.length == 0) {
            this.state = 'empty';
          } else {
            this.state = 'data';
          }

          this.loadMoreProgress = false;
        },
        error: () => {
          this.state = 'empty';
          this.loadMoreProgress = false;
        }
      });
  }

  subscribe(authorInfo: UserInfo) {
    this.subsService
      .subscribe(authorInfo?.nickname ?? '')
      .pipe(takeUntil(this.unSubscriber))
      .subscribe({
        next: () => this.searchAuthors(this.query),
      });
  }

  fillTag(tag: Tag) {
    this.formGroup.get('search')?.setValue(tag.value);
    this.byTag = true;
    this.submit();
  }
}
