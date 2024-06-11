import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Article, ContentService, Filter, Status} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, mergeMap, Observable, skipWhile, takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Editor, NgxEditorModule, Toolbar, Validators} from "ngx-editor";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrors} from "app/core/abstract/has-errors";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MaskitoOptions} from "@maskito/core";
import {MaterialModule} from "app/theme/material/material.module";
import {MaskitoDirective} from "@maskito/angular";
import {CommonModule} from "@angular/common";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {animations} from "app/core/config/app.animations";

@Component({
  selector: 'edit-article',
  standalone: true,
  animations: animations,
  imports: [CommonModule, TranslateModule, MaterialModule, NgxEditorModule, MaskitoDirective, NgxSkeletonLoaderModule, ReactiveFormsModule],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.less'
})
export class EditArticleComponent extends HasErrors implements OnInit {

  protected content: Article = {
    tags: new Array<string>()
  } as Article;
  protected state: 'form' | 'load' = 'form';
  protected editor: Editor | undefined;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
  ];

  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected tagCtrl: FormControl = new FormControl('');
  protected filteredTags: string[] = [];
  readonly maskitoOpt: MaskitoOptions = {
    mask: /\w/,
    preprocessors: [
      ({elementState, data}) => ({data: data.replaceAll(/\W|\d/g, ''), elementState}),
    ]
  };
  @ViewChild('tagsInput')
  protected tagsInput: ElementRef<HTMLInputElement> | undefined;

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

  get canPublish(): boolean {
    return this.content.status === Status.draft && this.formGroup?.valid;
  }

  get canUnpublish(): boolean {
    return ([Status.published, Status.pending].includes(this.content.status)) && this.formGroup.valid;
  }

  ngOnInit(): void {
    this.formGroup.addControl('content', new FormControl(null, Validators.required()));
    this.formGroup.addControl('title', new FormControl(null, Validators.required()));
    this.editor = new Editor();
    let id: string = this.aRouter.snapshot.params['id'];

    if (id) {
      this.state = 'load';
      this.contentService.get(id)
        .pipe(takeUntil(this.unSubscriber))
        .subscribe({
          next: it => {
            this.content = it;

            if (this.content.title) {
              this.formGroup.get('title')?.setValue(this.content.title);
            }

            if (this.content.content) {
              this.formGroup.get('content')?.setValue(this.content.content);
            }

            if (!this.content.tags) {
              this.content.tags = [];
            }

            this.state = 'form';
          },
          error: err => {
            this.state = 'form';
          }
        });
    }

    this.tagCtrl.valueChanges.pipe(
      debounceTime(300),
      skipWhile(val => val == null || val.toString()?.length < 3),
      takeUntil(this.unSubscriber),
      mergeMap(val => this.contentService.tags({page: 0, max: 100, query: val} as Filter)),
    ).subscribe({
      next: value => {
        this.filteredTags = [];

        value.forEach((it) => {

          if (it.includes(',')) {
            this.filteredTags.push(...it.split(','));
          } else {
            this.filteredTags.push(it);
          }
        });
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.editor?.destroy();
  }

  submit(): void {

    if (this.formGroup.valid) {
      this.state = 'load';
      this.save()
        .subscribe({
          next: it => {
            this.state = 'form';
            this.router.navigate(['/article/edit', it.id]).then();
          },
          error: err => {
            this.state = 'form';
            this.rejectErrors(...err.errors)
          }
        })
    }
  }

  add(): void {

    setTimeout(() => {

      if (this.tagsInput?.nativeElement.value) {
        this.content.tags.push('#' + this.tagsInput.nativeElement.value);
        this.tagCtrl.setValue(null);
        this.tagsInput.nativeElement.value = '';
      }
    }, 100)
  }

  remove(tag: string): void {
    const index = this.content.tags.indexOf(tag);

    if (index >= 0) {
      this.content.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;

    if (!this.content.tags.includes(value)) {
      this.content.tags.push(value);
    }

    if (this.tagsInput?.nativeElement.value) {
      this.tagsInput.nativeElement.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  changeStatus(status: Status) {

    if (this.content.status == status || status == null) {
      return;
    }

    this.contentService.changeStatus(this.content.id, status)
      .pipe(
        takeUntil(this.unSubscriber)
      )
      .subscribe(it => {

        if (it) {
          this.content.status = status;
        }
      });
  }

  protected preview() {

    if (this.formGroup.valid) {
      this.save().subscribe(it => {
        if (it.success) {
          this.router.navigate(['/article/view', it.id]).then();
        }
      });
    }
  }

  private save(): Observable<{ success: true, id: string }> {
    return this.contentService.save({
      id: this.content.id,
      title: this.formGroup.get('title')?.value,
      preView: this.getPreviewContent(),
      content: this.formGroup.get('content')?.value,
      tags: this.content.tags
    } as Article)
      .pipe(takeUntil(this.unSubscriber));
  }

  // TODO
  private getPreviewContent(): string {
    return "auto";
  }

  protected readonly Status = Status;
}
