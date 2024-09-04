import {Component, OnInit} from "@angular/core";
import {
  MatDialogActions,
  MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "app/core/core.module";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'language-dialog',
  templateUrl: './language.dialog.html',
  styleUrl: './language.dialog.less',
  standalone: true,
  imports: [CoreModule, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatFormField, MatLabel, MatOption, MatSelect, NgForOf, TranslateModule, MatButton],
})
export class ChangeLanguageDialog implements OnInit {

  protected readonly languages: Array<string> = ["ru", "en"];
  protected lang: string = '';

  constructor(
    private dialogRef: MatDialogRef<ChangeLanguageDialog>,
    protected translate: TranslateService,) {
  }

  ngOnInit() {
    this.lang = this.translate.getDefaultLang();
  }

  onLangChange(lang: string) {
    this.translate.setDefaultLang(lang);
    localStorage.setItem('currentLanguage', lang);
  }

  close() {
    this.dialogRef.close();
  }
}
