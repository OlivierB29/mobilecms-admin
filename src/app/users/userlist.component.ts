import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


import { AdminService } from 'src/app/shared/services';
import { LocaleService, Log } from 'src/app/shared';
import { User } from 'src/app/_models/index';

import { OrderbyPipe } from 'src/app/shared/filters';




@Component({

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



  constructor(private log: Log, private contentService: AdminService,
    locale: LocaleService, private route: ActivatedRoute,
    private orderby: OrderbyPipe, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.log.debug('RecordListComponent ');



    this.contentService.getIndex(this.type)
      .subscribe((data: any[]) => this.items = data,
        error => this.log.debug('getItems ' + error),
        () => {
          this.log.debug('getItems complete ' + this.type + ' ' + this.items.length);


        });

  }


  rebuildIndex() {
    this.contentService.rebuildIndex(this.type)
      .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('post' + error),
        () => { this.log.debug('post complete'); });

  }



}
