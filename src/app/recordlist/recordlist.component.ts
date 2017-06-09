import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ContentService } from '../_services/index';

import { User } from '../_models/index';
import { AuthenticationService } from '../_services/index';



@Component({
  moduleId: module.id,
  templateUrl: 'recordlist.component.html',
  styleUrls: ['recordlist.component.css']
})

export class RecordListComponent implements OnInit {


    currentUser: User;


  /**
   * record data
   */
  items: any[] = null;

  /**
   * current type : news, calendar, ...
   */
  type = '';

  /**
   * response on rebuild
   */
  response: any = null;


  /*

  https://material.angular.io/components/component/sidenav
  */
  menuMode:  'side';

  /*
  opened
  https://www.npmjs.com/package/@angular2-material/sidenav
  */
  menuOpened: true;


  constructor(private route: ActivatedRoute, private contentService: ContentService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    console.log('RecordListComponent ');

    this.currentUser = this.authenticationService.initUser();


    this.route.params.forEach((params: Params) => {


      this.type = params['type'];

      if (this.type) {

        this.contentService.getIndex(this.type)
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
