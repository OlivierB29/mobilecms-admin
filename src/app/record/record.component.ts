import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ContentService } from '../_services/index';
import { Metadata } from 'app/_models';

@Component({
  moduleId: module.id,
  templateUrl: 'record.component.html'
})

export class RecordComponent implements OnInit {

  i18n = {};

  /**
   * current type : news, calendar, ...
   */
  type: string = '';

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


  constructor(private route: ActivatedRoute, private contentService: ContentService) { }


  ngOnInit() {


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

      if (this.id) {

        //read record content
        this.contentService.getRecord(this.type, this.id)
          .subscribe((data: any) => {
            this.current = data;
            if (!this.current.images) {
              this.current.images = [];
            }
            this.images = this.current.images;

            if (!this.current.attachments) {
              this.current.attachments = [];
            }
            this.attachments = this.current.attachments;

          },
          error => console.error('get' + error),
          () => {
            console.log('get complete' + JSON.stringify(this.current));
        });
      } else {
        console.error("editcalendar-form empty id");
      }

    });

  }

  addImage() {
    //TODO : create a image_metadata.json
    this.images.push(JSON.parse('{"url":"", "title":""}'));
  }

  addAttachment() {
    //TODO : create a attachment_metadata.json
    this.attachments.push(JSON.parse('{"url":"", "title":""}'));
  }

  save() {
    this.contentService.post(this.type, this.current)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('post' + error),
      () => { console.log('post complete'); });

  }
}
