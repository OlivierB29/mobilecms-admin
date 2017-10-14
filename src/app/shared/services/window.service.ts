import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WindowService {

  layout: string;


  constructor() {
    this.layout = this.initLayout();
  }

  public isMobile() {
      return 'mobile' === this.layout;
  }

  public isDesktop() {
      return 'mobile' !== this.layout;
  }

  private initLayout(): string {

    let layout = 'mobile';

    if (window.matchMedia('(min-width: 55em)').matches) {
      layout = 'desktop';
    }
    return layout;
  }

  public getLayout() {
    return this.layout;
  }

}
