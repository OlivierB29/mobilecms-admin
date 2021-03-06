import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = '';
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(environment.defaultlocale);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(environment.defaultlocale);
  }
}
