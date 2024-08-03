import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'any'
})
export class ThemeDataService  {
  private darkMode: boolean;

  constructor() {
    this.darkMode = document.body.getAttribute("data-theme") == "dark";
  }

  public get isDarkMode(): boolean {
    return this.darkMode;
  }

  init() {
    let storageValue: string | null = localStorage.getItem('data-theme');

    if (storageValue == null && !this.isSystemDark() && this.isDarkMode ||
      storageValue == null && this.isSystemDark() && !this.isDarkMode ||
      storageValue == 'dark' && !this.isDarkMode ||
      storageValue == 'light' && this.isDarkMode) {
      this.switchMode();
    }
  }

  switchMode(): void {
    this.darkMode = !this.darkMode;

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
