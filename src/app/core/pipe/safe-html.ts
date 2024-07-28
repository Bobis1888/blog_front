import {DomSanitizer, SafeHtml} from '@angular/platform-browser'
import {Pipe, PipeTransform, SecurityContext} from "@angular/core";

@Pipe({standalone: true, name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value: string): SafeHtml {
    let processed = this.sanitized.sanitize(SecurityContext.STYLE, value);

    if (processed) {
      processed = processed.replace(/color:#.{0,6};/g, '');
    }

    return this.sanitized.bypassSecurityTrustHtml(processed ?? '');
  }
}
