import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog } from '@angular/material';


import { AuthenticationService, AdminService, LocaleService } from 'app/_services/index';

import { User } from 'app/_models/index';

import { OrderbyPipe } from 'app/shared/filters';

import { StandardComponent } from 'app/home';

@Component({
  moduleId: module.id,
  selector: 'app-userlist',
  templateUrl: 'userlist.component.html',
  styleUrls: ['userlist.component.css']
})

export class UserListComponent implements OnInit {




  /**
   * record data
   */
  items: any[] = null;

  /**
   * current type : news, calendar, ...
   */
  type = 'users';


  @Input() recordtype: string;

  /**
   * response on rebuild
   */
  response: any = null;



  constructor(private contentService: AdminService,
      locale: LocaleService, private route: ActivatedRoute,
  private orderby: OrderbyPipe, public dialog: MdDialog) {

 }

  ngOnInit() {
    console.log('RecordListComponent ');



        this.contentService.getIndex(this.type)
          .subscribe((data: any[]) => this.items = data,
          error => console.log('getItems ' + error),
          () => {
            console.log('getItems complete ' + this.type + ' ' + this.items.length);


          });







  }


  rebuildIndex() {
    this.contentService.rebuildIndex(this.type)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('post' + error),
      () => { console.log('post complete'); });

  }



}
