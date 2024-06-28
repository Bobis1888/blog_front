import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContentService, Status, TagsFilter} from "src/app/core/service/content/content.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {debounceTime, mergeMap, Observable, of, skipWhile, takeUntil} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Editor, NgxEditorModule, Toolbar, Validators} from "ngx-editor";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrors} from "app/core/abstract/has-errors";
import {TranslateModule} from "@ngx-translate/core";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MaskitoOptions} from "@maskito/core";
import {MaterialModule} from "app/theme/material/material.module";
import {MaskitoDirective} from "@maskito/angular";
import {CommonModule} from "@angular/common";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {animations} from "app/core/config/app.animations";
import {Content} from "app/core/service/content/content";
import {Actions} from "app/core/service/content/actions";
import {MatDialog} from "@angular/material/dialog";
import {ChangeStatusDialog} from "app/pages/content/change-status-dialog/change-status.dialog";
import {EditPreviewDialog} from "app/pages/content/edit-preview-dialog/edit-preview-dialog.component";
import {DeleteDialog} from "app/pages/content/delete-dialog/delete.dialog";

@Component({
  selector: 'edit-content',
  standalone: true,
  animations: animations,
  imports: [CommonModule, TranslateModule, MaterialModule, NgxEditorModule, MaskitoDirective, NgxSkeletonLoaderModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-content.component.html',
  styleUrl: './edit-content.component.less'
})
export class EditContentComponent extends HasErrors implements OnInit {

  protected content: Content = {
    tags: new Array<string>(),
    actions: {
      canEdit: true
    } as Actions
  } as Content;
  protected state: 'form' | 'load' = 'form';
  protected editor: Editor | undefined;

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote',
      {heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']},
      'align_left', 'align_center', 'align_right', 'align_justify', 'ordered_list',
      'bullet_list', 'link', 'image', 'text_color', 'background_color'],
  ];

  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected filteredTags: string[] = [];
  readonly maskitoOpt: MaskitoOptions = {
    mask: /\w/,
    preprocessors: [
      ({elementState, data}) => ({data: data.replaceAll(/\W|\d/g, ''), elementState}),
    ]
  };
  @ViewChild('tagsInput')
  protected tagsInput: ElementRef<HTMLInputElement> | undefined;

  protected readonly Status = Status;

  constructor(private contentService: ContentService,
              protected deviceService: DeviceDetectorService,
              private router: Router,
              protected matDialog: MatDialog,
              private aRouter: ActivatedRoute) {
    super();
  }

  get tagCtrl(): FormControl {
    return this.formGroup.get("tagCtrl") as FormControl;
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup.addControl('content', new FormControl(null, Validators.required()));
    this.formGroup.addControl('title', new FormControl(null, Validators.required()));
    this.formGroup.addControl('tagCtrl', new FormControl(null));
    this.title.setTitle(this.translate.instant('editContentPage.metaTitle'));

    this.editor = new Editor({
      keyboardShortcuts: true,
    });

    let id: string = this.aRouter.snapshot.params['id'];

    if (id) {
      this.init(id);
    }

    this.tagCtrl.valueChanges.pipe(
      debounceTime(500),
      skipWhile(val => val == null || val.toString()?.length < 2),
      takeUntil(this.unSubscriber),
      mergeMap(val => this.contentService.tags({page: 0, max: 100, query: val} as TagsFilter)),
    ).subscribe({
      next: value => {
        this.filteredTags = [];

        value.forEach((it): void => {

          if (it.includes(',')) {
            this.filteredTags.push(...it.split(','));
          } else {
            this.filteredTags.push(it);
          }
        });

        if (this.filteredTags.length == 0) {
          this.filteredTags.push("#" + this.tagCtrl.value);
        }
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.editor?.destroy();
  }

  protected submit(): void {

    if (this.formGroup.valid) {
      this.state = 'load';
      this.save()
        .pipe(
          takeUntil(this.unSubscriber),
        )
        .subscribe({
          next: it => this.init(it.id),
          error: err => {
            this.state = 'form';
            this.rejectErrors(...err.errors)
          }
        })
    }
  }

  protected add(): void {

    setTimeout(() => {

      if (this.tagsInput?.nativeElement.value) {
        this.content.tags.push('#' + this.tagsInput.nativeElement.value);
        this.tagCtrl.setValue(null);
        this.tagsInput.nativeElement.value = '';
      }
    }, 100)
  }

  protected remove(tag: string): void {
    const index = this.content.tags.indexOf(tag);

    if (index >= 0) {
      this.content.tags.splice(index, 1);
    }
  }

  protected selected(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.viewValue;

    if (!this.content.tags.includes(value)) {
      this.content.tags.push(value);
    }

    if (this.tagsInput?.nativeElement.value) {
      this.tagsInput.nativeElement.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  protected changeStatus(status: Status) {

    if (this.content.status == status || status == null) {
      return;
    }

    this.state = 'load';

    let subs: Observable<any> = of({success: true});

    if (status == Status.published) {
      subs = this.save();
    }

    subs.pipe(
      mergeMap(() => this.matDialog.open(ChangeStatusDialog, {
        data: {
          id: this.content.id,
          status: status
        }
      }).afterClosed()),
      takeUntil(this.unSubscriber)
    )
      .subscribe({
        next: (it) => {

          if (it) {
            this.init(this.content.id)
          } else {
            this.state = 'form';
          }

        },
        error: (err) => {
          this.state = 'form';
          this.rejectErrors(...err.errors);
        }
      });
  }

  private init(id: string) {
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

          if (!this.content.actions?.canEdit) {
            this.formGroup.disable();
          } else {
            this.formGroup.enable();
          }
        },
        error: err => {
          this.state = 'form';
          this.rejectErrors(...err.errors);
        }
      });
  }

  protected delete() {
    this.matDialog.open(DeleteDialog, {
      id: this.content.id
    }).afterClosed().subscribe({
      next: it => {
        if (it) {
          this.router.navigate(['/']).then();
          return;
        }
      }
    });
  }

  private save(): Observable<{ success: true, id: string }> {
    return this.contentService.save({
      id: this.content.id,
      title: this.formGroup.get('title')?.value,
      preView: this.content.preView ?? 'auto',
      content: this.formGroup.get('content')?.value,
      tags: this.content.tags
    } as Content)
      .pipe(takeUntil(this.unSubscriber));
  }

  editPreview() {
    this.state = 'load';
    this.matDialog.open(EditPreviewDialog, {
      data: {id: this.content.id, content: this.content.preView}
    }).afterClosed().pipe(
      takeUntil(this.unSubscriber),
    ).subscribe({
      next: (it) => {
        if (it) {
          this.init(this.content.id);
        } else {
          this.state = 'form';
        }
      }
    })
  }
}
