export abstract class L10n {

  private locale: string = "RU"

  public l10n(key: string): string {
    console.log("key", key);
    return key;
  }

  public setLocale(locale: string): void {

    if (locale == null || locale == "") {
      locale = "RU"
    }

    this.locale = locale
  }
}
