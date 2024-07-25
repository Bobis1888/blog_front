import {UnSubscriber} from "src/app/core/abstract/un-subscriber";
import {FormGroup} from "@angular/forms";

export interface Error {
  code: string;
  field: string;
  args: any;
}

export abstract class HasErrors extends UnSubscriber {
  protected errors: Error[] = [];
  protected formGroup: FormGroup = new FormGroup({});

  protected get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  protected reject(code: string, field: string, args: any = {}) {
    let err = {code, field, args};
    this.rejectErrors(err);
  }

  protected rejectErrors(...error: Error[]) {

    if (error != null && error.length > 0) {
      this.errors.push(...error);
    }

    this.errors.forEach(it => {

      if (this.formGroup.contains(it.field)) {
        this.formGroup.get(it.field)?.setErrors({[it.code]: true});
      }
    });
  }

  protected clearErrors() {
    this.errors = [];
    this.formGroup.clearValidators();
    this.formGroup.reset(this.formGroup.value);
  }

  protected fieldHasErrors(field: string) {

    if (!this.formGroup.contains(field)) {
      return false;
    }

    return this.formGroup.get(field)?.valid == false;
  }

  protected getErrorCodes(field: string): string[] {
    return this.errors
      .filter(it => it.field == field)
      .map(it => it.code);
  }

  //TODO refactor
  protected getErrors(field: string): string {
    let errors = this.errors.filter(error => error.field === field);

    let res: string = ''

    errors.forEach((it: Error) => {
      let message = this.translate.instant(`errors.${it.field}.${it.code}`, it.args ?? {});
      res += message + '\n';
    });

    return res;
  }
}
