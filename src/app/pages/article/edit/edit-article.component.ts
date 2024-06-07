import {Component, OnInit} from '@angular/core';
import {Article, ContentService} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RootModule} from "src/app/root.module";
import {takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Editor, Validators} from "ngx-editor";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrors} from "app/core/abstract/has-errors";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'edit-article',
  standalone: true,
  imports: [RootModule, ReactiveFormsModule],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.less'
})
export class EditArticleComponent extends HasErrors implements OnInit {

  protected content: Article = {} as Article;
  protected state: 'data' | 'loading' | 'empty' = 'loading';
  protected editor: Editor | undefined;

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private router: Router,
              translate: TranslateService,
              private aRouter: ActivatedRoute) {
    super(translate);
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup.addControl('content', new FormControl(null, Validators.required()));
    this.formGroup.addControl('title', new FormControl(null, Validators.required()));

    this.editor = new Editor();


    let id = this.aRouter.snapshot.queryParamMap?.get("id");

    if (!id) {
      id = this.aRouter.snapshot.params['id'];
    }

    if (id == null || id == '') {
      this.state = 'data';
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

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.editor?.destroy();
  }

  submit(): void {

    if (this.formGroup.valid) {
      this.state = 'loading';
      this.contentService.save({
        title: this.formGroup.get('title')?.value,
        preView: 'preView',
        content: this.formGroup.get('content')?.value,
      } as Article)
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
        next: it => {
          this.state = 'data';
          this.router.navigate(['/article', it.id]);
        },
          error: err => {
            this.state = 'data';
            this.rejectErrors(...err.errors)
          }
      })
    }
  }
}
