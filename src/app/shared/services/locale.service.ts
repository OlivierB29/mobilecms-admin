import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocaleService {
  private i18n = 'i18n-admin';

  private lang = 'en';

  constructor(private http: HttpClient) {
    this.lang = this.initLang();
  }

  public getLang(): string {
    return this.lang;
  }

  initLang(): string {
    let lang = 'en';
    if (navigator) {
      const navlang = navigator.language;
      if (navlang === 'fr-FR' || navlang === 'fr') {
        lang = 'fr';
      }
    }

    return lang;
  }

  public getLocale = (uri: string, locale: string): Observable<any> => {
      const url = this.i18n  +  uri  +  '/'  +  locale  +  '.json';

      return this.http.get<any>(url);
  }



}
