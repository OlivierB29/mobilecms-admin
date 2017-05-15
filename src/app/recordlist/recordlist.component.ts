import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ContentService } from '../_services/index';

import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  moduleId: module.id,
  templateUrl: 'recordlist.component.html',
  styleUrls: ['recordlist.component.css']
})

export class RecordListComponent implements OnInit {

  /**
   * record data
   */
  items: any[] = [];

  /**
   * current type : news, calendar, ...
   */
  type = '';

  /**
   * response on rebuild
   */
  response: any = null;



  constructor(private route: ActivatedRoute, private contentService: ContentService, private translate: TranslateService) { }

  ngOnInit() {
    console.log('RecordListComponent ');

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('fr');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('fr');

    this.route.params.forEach((params: Params) => {


      this.type = params['type'];

      if (this.type) {

        this.contentService.getRecords(this.type)
          .subscribe((data: any[]) => this.items = data,
          error => console.log('getItems ' + error),
          () => {
            console.log('getItems complete ' + this.type + ' ' + this.items.length);
          });

      }

    });




  }


  rebuildIndex() {
    this.contentService.rebuildIndex(this.type)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('post' + error),
      () => { console.log('post complete'); });

  }

}
