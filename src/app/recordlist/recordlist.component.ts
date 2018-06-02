
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material';

import { RecordListHelpDialogComponent } from './recordlisthelpdialog.component';

import { ContentService } from 'app/shared/services';
import { AlertService, LocaleService, WindowService } from 'app/shared';
import { User } from 'app/_models/index';

import { OrderbyPipe } from 'app/shared/filters';

import { StandardComponent } from 'app/home';
import { Log } from 'app/shared';

@Component({
  moduleId: module.id,
  selector: 'app-recordlist',
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
  type = 'calendar';


  @Input() recordtype = 'calendar';

  /**
   * response on rebuild
   */
  response: any = null;

  displayedColumns = [];

  constructor(
    private logger: Log,
    private contentService: ContentService,
      locale: LocaleService, private route: ActivatedRoute,
      private windowService: WindowService, private orderby: OrderbyPipe,
       public dialog: MatDialog) {
   super(logger);
   this.log.debug("RecordListComponent")
 }

 getLayout(): string {
   return this.windowService.getLayout();
 }

  ngOnInit() {
    super.ngOnInit();
    this.log.debug('RecordListComponent ');


    this.route.params.forEach((params: Params) => {


      const routetype = params['type'];

      if (routetype || this.recordtype) {

        if (routetype) {
          this.type = routetype;
        } else {
          this.type = this.recordtype;
        }

        this.contentService.getIndex(this.type)
          .subscribe((data: any[]) => this.items = data,
          error => this.log.debug('getItems ' + error),
          () => {
            this.log.debug('getItems complete ' + this.type + ' ' + this.items.length);

            this.sort();

            this.initColumns();


          });

      }

    });




  }

  initColumns() {
    if (this.items.length > 0) {
      this.displayedColumns = [];
      if (this.items[0].date) {
        this.displayedColumns.push('date');
      }
      if (this.items[0].title) {
        this.displayedColumns.push('title');
      } else if (this.items[0].id)  {
        this.displayedColumns.push('id');
      }
    }
  }

  sort() {
    // TODO generic sort by metadata
    if (this.items.length > 0 && this.items[0].date) {
      this.orderby.transform(this.items, 'date', 'desc');
    }

  }


  rebuildIndex() {
    this.contentService.rebuildIndex(this.type)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('post' + error),
      () => { this.log.debug('post complete'); });

  }

  /**
  * help
  */
  openHelpDialog() {
    const dialogRef = this.dialog.open(RecordListHelpDialogComponent, {
       data: '',
    });
    dialogRef.afterClosed().subscribe(result => { this.log.debug('Dialog result'); });
  }

}
