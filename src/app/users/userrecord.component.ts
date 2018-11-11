import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from 'src/app/_models';

import { AdminService, UploadService } from 'src/app/shared/services';
import { LocaleService, StringUtils, Log } from 'src/app/shared';
import { StandardComponent } from 'src/app/home';


import { DeleteUserDialogComponent } from './deleteuserdialog.component';
import { SecurityService } from '../shared';


@Component({
  
  templateUrl: 'userrecord.component.html',
  styleUrls: ['userrecord.component.css']
})

export class UserRecordComponent implements OnInit {

  i18n = {};

  /**
   * current type : news, calendar, ...
   */
  type = 'users';

  /**
   * object id
   */
  id = '';

  /**
   * object data
   */
  current: any = null;


  files: any[] = null;


  /**
   * object metadata
   */
  properties: Metadata[];


  /**
   * response on save
   */
  response: any = null;

  /**
  * if new record, not saved on backend
  */
  newrecord = false;



  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;


  constructor(
    protected log: Log,
    private contentService: AdminService,
    private securityService: SecurityService,

      locale: LocaleService,
      private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private uploadService: UploadService, private stringUtils: StringUtils) {
   }

  ngOnInit() {
    this.log.debug('record.component');

    this.route.params.forEach((params: Params) => {

      this.id = params['id'];

      this.log.debug('edit:' + this.type + ' id:' + this.id);

      if (this.type) {
        // read metadata of record

        this.contentService.getMetadata(this.type)
          .subscribe((data: any[]) => { this.properties = data; },
          error => this.log.debug('loadMetadata ' + error),
          () => this.log.debug('loadMetadata OK'));
      }

      if (this.id && this.id !== 'new') {



        // read record content
        this.contentService.getRecord(this.type, this.id)
          .subscribe((data: any) => {
            this.current = data;


          },
          error => console.error('get' + error),
          () => {
            this.log.debug('get complete' + JSON.stringify(this.current));
          });
      } else {
        this.log.debug('editcalendar-form empty id');

        this.newrecord = true;

        this.contentService.getNewRecord(this.type)
          .subscribe((data: any) => {
            this.current = data;

          },
          error => this.log.debug('getNewRecord ' + error),
          () => this.log.debug('getNewRecord OK'));
      }



    });

  }



    save() {
      const timestamp = new Date().getTime();
      this.responsemessage = {};

      if (this.newrecord) {

      this.contentService.postUser(this.type, this.current)
        .subscribe((data: any) => {
          this.response = data;
        },
        error => {
          this.responsemessage.error = JSON.stringify(error);
      },
        () => {
          // calculate diff from PHP time https://stackoverflow.com/questions/13022524/javascript-time-to-php-time
          // const timestamp = Number.parseInt(this.response.timestamp) * 1000;

          // savedate
          const savedate = new Date();
          savedate.setTime(timestamp);
          this.responsemessage.savedate = savedate.toLocaleDateString() + ' ' + savedate.toLocaleTimeString();

          // time since save
          const diffMilli = new Date().getTime() - timestamp;
          if (diffMilli < 1000) {
            this.responsemessage.since = '< 1s';
          } else {
            this.responsemessage.since = (diffMilli / 1000).toString();
          }

          // forward to record modification page
          // forward to record modification page
          if (this.newrecord) {
            this.router.navigate(['/userrecord', this.current.email]);
          }


          this.log.debug('post complete');
        });

      } else {
              this.contentService.updateUser(this.type, this.current)
                .subscribe((data: any) => {
                  this.response = data;
                },
                error => {
                  this.responsemessage.error = error;
                  console.error('post' + error);
              },
                () => {
                  // calculate diff from PHP time https://stackoverflow.com/questions/13022524/javascript-time-to-php-time
                  // const timestamp = Number.parseInt(this.response.timestamp) * 1000;

                  // savedate
                  const savedate = new Date();
                  savedate.setTime(timestamp);
                  this.responsemessage.savedate = savedate.toLocaleDateString() + ' ' + savedate.toLocaleTimeString();

                  // time since save
                  const diffMilli = new Date().getTime() - timestamp;
                  if (diffMilli < 1000) {
                    this.responsemessage.since = '< 1s';
                  } else {
                    this.responsemessage.since = (diffMilli / 1000).toString();
                  }

                  // forward to record modification page
                  if (this.newrecord) {
                    this.router.navigate(['/userrecord', this.current.email]);
                  }


                  this.log.debug('post complete');
                });

      }

    }







  /**
  * delete
  */
  openConfirmDialog() {

    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
       data: this.current.email,
    });

    dialogRef.afterClosed().subscribe(result => {
  this.log.debug(`Dialog result: ${result}`);

  if (result) {
    this.delete();
  }
});

  }


  /**
  * must click on dialog first
  */
    private delete() {

      this.contentService.delete(this.type, this.current.email)
        .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('delete ' + error),
        () => {

          // forward to record modification page
          this.router.navigate(['/userlist']);


          this.log.debug('delete complete');
        });

    }

    /**
    * help
    */
    openHelpDialog() {
      this.log.debug('openHelpDialog');
    }


  /**
   * About roles : this just a frontend feature. Role must be tested in the API.
   */
  isAdminRole(): boolean {

    return this.securityService.isAdminRole();
  }

    rebuildIndex() {
      this.contentService.rebuildIndex(this.type)
        .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('post' + error),
        () => { this.log.debug('post complete'); });

    }
}
