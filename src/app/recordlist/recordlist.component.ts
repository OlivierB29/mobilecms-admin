import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog } from '@angular/material';

import { RecordListHelpDialogComponent } from './recordlisthelpdialog.component';

import { AuthenticationService, ContentService, LocaleService } from '../_services/index';

import { User } from '../_models/index';

import { OrderbyPipe } from '../shared/filters';

import { StandardComponent } from 'app/home';

@Component({
  moduleId: module.id,
  templateUrl: 'recordlist.component.html',
  styleUrls: ['recordlist.component.css']
})

export class RecordListComponent extends StandardComponent implements OnInit {




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



  constructor(contentService: ContentService,
      authenticationService: AuthenticationService,
      locale: LocaleService, private route: ActivatedRoute,
  private orderby: OrderbyPipe, public dialog: MdDialog) {
   super(contentService, authenticationService, locale);
 }

  ngOnInit() {
    super.ngOnInit();
    console.log('RecordListComponent ');


    this.route.params.forEach((params: Params) => {


      this.type = params['type'];

      if (this.type) {

        this.contentService.getIndex(this.type)
          .subscribe((data: any[]) => this.items = data,
          error => console.log('getItems ' + error),
          () => {
            console.log('getItems complete ' + this.type + ' ' + this.items.length);

            // TODO generic sort by metadata
            if (this.items.length > 0 && this.items[0].date) {
              this.orderby.transform(this.items, 'date', 'desc');
            }


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

  /**
  * help
  */
  openHelpDialog() {
    const dialogRef = this.dialog.open(RecordListHelpDialogComponent, {
       data: '',
    });
    dialogRef.afterClosed().subscribe(result => { console.log('Dialog result'); });
  }

}
