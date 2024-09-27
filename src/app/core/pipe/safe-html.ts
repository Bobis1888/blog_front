import {DomSanitizer, SafeHtml} from '@angular/platform-browser'
import {Injectable, Pipe, PipeTransform, SecurityContext} from "@angular/core";

@Pipe({standalone: true, name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private safeHtmlService: SafeHtmlService) {
  }

  transform(value: string): SafeHtml {
    return this.safeHtmlService.transformToSafeHtml(value);
  }
}

@Injectable({
  providedIn: 'any'
})
export class SafeHtmlService {
  constructor(private sanitized: DomSanitizer) {}

  transformToSafeHtml(value: string): SafeHtml {
    let processed = this.sanitize(value ?? '');
    return this.sanitized.bypassSecurityTrustHtml(processed ?? '');
  }

  sanitize(value: string): string {
    let processed = this.sanitized.sanitize(SecurityContext.STYLE, value);

    if (processed) {
      processed = processed.replace(/(background-color|color):(.{0,10}|(rgb|rgba)\(.{0,20}\));/g, '');
    }

    return processed ?? '';
  }
}
