import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class LocaleService {
  private i18n = 'i18n-admin';

  private lang = 'en';

  constructor(private http: Http) {
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

      return this.http.get(url)
          .map((response: Response) => response.json())
          .catch(this.handleError);
  }

  private handleError(error: Response) {
      console.error('LocaleService.handleError '  +  error.statusText);
      return Observable.throw(error.json().error || 'Server error');
  }

}
