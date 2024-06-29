import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'any'
})
export class ThemeDataService  {
  public isDarkMode: boolean = true;

  init() {
    this.isDarkMode = document.body.getAttribute("data-theme") == "dark";
    let storageValue: string | null = localStorage.getItem('data-theme');

    if (storageValue == null && !this.isSystemDark() && this.isDarkMode ||
      storageValue == null && this.isSystemDark() && !this.isDarkMode ||
      storageValue == 'dark' && !this.isDarkMode ||
      storageValue == 'light' && this.isDarkMode) {
      this.switchMode();
    }
  }

  switchMode(): void {
    this.isDarkMode = !this.isDarkMode;

    document.body.setAttribute(
      'data-theme',
      this.isDarkMode ? 'dark' : 'light',
    );

    localStorage.setItem('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  isSystemDark(): boolean {
    return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches;
  }
}
