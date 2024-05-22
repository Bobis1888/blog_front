export class CookieService {
  static getCookie(name: string) {
    let _document: any;

    try {
      _document = document || {cookie: ''};
    } catch (e) {
      console.error(e);
      _document = {cookie: ''};
    }

    const ca: Array<string> = _document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');

      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }

    return '';
  }
}
