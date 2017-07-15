import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from '../_models';
import { ContentService, StringUtils } from 'app/_services';
import { environment } from '../../environments/environment';
import { DeleteDialogComponent } from './deletedialog.component';

@Component({
  moduleId: module.id,
  templateUrl: 'record.component.html',
  styleUrls: ['record.component.css']
})

export class RecordComponent implements OnInit {

  i18n = {};

  /**
   * current type : news, calendar, ...
   */
  type = '';

  /**
   * object id
   */
  id = '';

  /**
   * object data
   */
  current: any = null;

  /**
  * list of images
  */
  images: any[] = null;

  /**
  * list of attachments
  */
  attachments: any[] = null;

  /**
   * object metadata
   */
  properties: Metadata[];


  /**
   * response on save
   */
  response: any = null;

  newrecord = false;

  hasRole = false;

  hasAdminRole = false;

  currentUser: User;

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MdDialog,
    private contentService: ContentService, private stringUtils: StringUtils) { }

  private initRoles(): void {
    this.hasAdminRole = this.currentUser.role === 'admin';
    this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
  }

  ngOnInit() {

    const currentUserLocalStorage = localStorage.getItem('currentUser');

    if (currentUserLocalStorage) {
      this.currentUser = JSON.parse(currentUserLocalStorage);
    }
    this.initRoles();

    this.route.params.forEach((params: Params) => {

      this.type = params['type'];

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

            if (this.current) {
              if (!this.current.images) {
                this.current.images = [];
              }
              this.images = this.current.images;

              if (!this.current.attachments) {
                this.current.attachments = [];
              }
              this.attachments = this.current.attachments;


              // old date format converter. yyyyMMdd -> yyyy-MM-dd
              if (this.current.date) {
                const oldDate = this.stringUtils.parseOldDate(this.current.date);
                if (oldDate) {
                  this.current.date = oldDate;
                }
              }

            }
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

            if (this.current) {
              if (!this.current.images) {
                this.current.images = [];
              }
              this.images = this.current.images;

              if (!this.current.attachments) {
                this.current.attachments = [];
              }
              this.attachments = this.current.attachments;


            }
          },
          error => console.log('getNewRecord ' + error),
          () => console.log('getNewRecord OK'));
      }



    });

  }

  addImage() {
    // TODO : create a image_metadata.json
    this.images.push(JSON.parse('{"url":"", "title":""}'));
  }

  generateId() {
    if (this.newrecord || this.hasAdminRole) {
      // replace accents by US ASCII
      let newId = this.stringUtils.removeDiacritics(this.current.title);

      // remove all remaining special characters
      newId = newId.replace(/[^\w\s]/gi, '');

      // replace space by '-'
      newId = newId.replace(/\s/g, '-');

      this.current.id = newId;
    }

  }


  addAttachment() {
    // TODO : create a attachment_metadata.json
    this.attachments.push(JSON.parse('{"url":"", "title":""}'));
  }

  save() {
    this.generateId();
    this.contentService.post(this.type, this.current)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('post' + error),
      () => {

        // forward to record modification page
        if (this.newrecord) {
          this.router.navigate(['/record', this.type, this.current.id]);
        }

        console.log('post complete');
      });

  }

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

  deleteImage(index: number) {
    if (index > -1) {
      this.images.splice(index, 1);
    }
  }

  deleteAttachment(index: number) {
    if (index > -1) {
      this.attachments.splice(index, 1);
    }
  }

  preview() {
    this.generateId();
    const url = environment.website + '/' + this.type + '/' + this.id;
    window.open(url, '_blank');
  }


  openConfirmDialog() {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
       data: this.current.title,
    });

    dialogRef.afterClosed().subscribe(result => {
  console.log(`Dialog result: ${result}`); // Pizza!

  if (result) {
    this.delete();
  }
});

  }

}
