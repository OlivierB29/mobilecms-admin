import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from 'app/_models';

import { AuthenticationService, AdminService, LocaleService, UploadService, StringUtils } from 'app/_services/index';
import { StandardComponent } from 'app/home';

import { environment } from '../../environments/environment';
import { DeleteUserDialogComponent } from './deleteuserdialog.component';

@Component({
  moduleId: module.id,
  templateUrl: 'userrecord.component.html',
  styleUrls: ['userrecord.component.css']
})

export class UserRecordComponent extends StandardComponent implements OnInit {

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


  constructor(private contentService: AdminService,
      authenticationService: AuthenticationService,
      locale: LocaleService,
      private route: ActivatedRoute, private router: Router, public dialog: MdDialog,
    private uploadService: UploadService, private stringUtils: StringUtils) {
    super();
   }

  ngOnInit() {
    super.ngOnInit();
    console.log('record.component');

    this.route.params.forEach((params: Params) => {

      this.id = params['id'];

      console.log('edit:' + this.type + ' id:' + this.id);

      if (this.type) {
        // read metadata of record

        this.contentService.getMetadata(this.type + '/index/metadata.json')
          .subscribe((data: any[]) => { this.properties = data; },
          error => console.log('loadMetadata ' + error),
          () => console.log('loadMetadata OK'));
      }

      if (this.id && this.id !== 'new') {



        // read record content
        this.contentService.getRecord(this.type, this.id)
          .subscribe((data: any) => {
            this.current = data;


          },
          error => console.error('get' + error),
          () => {
            console.log('get complete' + JSON.stringify(this.current));
          });
      } else {
        console.log('editcalendar-form empty id');

        this.newrecord = true;

        this.contentService.getNewRecord(this.type + '/index/new.json')
          .subscribe((data: any) => {
            this.current = data;

          },
          error => console.log('getNewRecord ' + error),
          () => console.log('getNewRecord OK'));
      }



    });

  }



    save() {

      this.responsemessage = {};

      if (this.newrecord) {

      this.contentService.postUser(this.type, this.current)
        .subscribe((data: any) => {
          this.response = data;
        },
        error => {
          this.responsemessage.error = error;
          console.error('post' + error);
      },
        () => {
          // calculate diff from PHP time https://stackoverflow.com/questions/13022524/javascript-time-to-php-time
          const timestamp = Number.parseInt(this.response.timestamp) * 1000;

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


          console.log('post complete');
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
                  const timestamp = Number.parseInt(this.response.timestamp) * 1000;

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


                  console.log('post complete');
                });

      }

    }







  /**
  * delete
  */
  openConfirmDialog() {

    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
       data: this.current.title,
    });

    dialogRef.afterClosed().subscribe(result => {
  console.log(`Dialog result: ${result}`);

  if (result) {
    this.delete();
  }
});

  }


  /**
  * must click on dialog first
  */
    private delete() {

      this.contentService.delete(this.type, this.current.id)
        .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('delete ' + error),
        () => {

          // forward to record modification page
          this.router.navigate(['/recordlist', this.type]);


          console.log('delete complete');
        });

    }

    /**
    * help
    */
    openHelpDialog() {
      console.log('openHelpDialog');
    }

    isAdminRole() {
      return this.hasAdminRole;
    }
}
