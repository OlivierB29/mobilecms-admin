import { Component, OnInit, Input } from '@angular/core';

import { UploadService } from 'app/_services';

@Component({
  moduleId: module.id,
  selector: 'app-editlinks',
  templateUrl: 'editlinks.component.html',
  styleUrls: ['editlinks.component.css']
})
export class EditLinksComponent implements OnInit {
  /**
   * title
   */
  @Input() title = 'record.edit.attachments';

  /**
   * object data
   */
  @Input() type: string = null;

  /**
   * object data
   */
  @Input() protected current: any = null;

  @Input() protected attachments: any[];

  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;

  constructor(protected uploadService: UploadService) { }

  ngOnInit() {
    if (!this.type) {
      console.error('empty type');
    }
    if (!this.current) {
      console.error('empty current');
    }
    if (!this.attachments) {
      console.error('empty attachments');
    }
  }

  /**
  * add an attachment at the beginning
  */
  addAttachmentTop() {

  this.attachments.push(this.getDefaultAttachment());
  this.attachments = this.move(this.attachments, this.attachments.length - 1, 0);
  }

/**
* move item in array
* TODO : utility class
*/
  private move(array: Array<any>, old_index: number, new_index: number): Array<any> {
    if (new_index >= array.length) {
        let k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array;
}

/**
* move an attachment upward
*/
moveAttachmentUp(index: number) {
  if (index > -1 ) {
    this.move(this.attachments, index, index - 1);
  }
}

/**
* move an attachment downward
*/
moveAttachmentDown(index: number) {
  const newPosition = index + 1;
  if (index > -1 && newPosition < this.attachments.length) {
    this.move(this.attachments, index, newPosition);
  }
}

  addAttachmentBottom() {
    this.attachments.push(this.getDefaultAttachment());
  }

  private getDefaultAttachment(): any {
    // TODO : create a attachment_metadata.json
    return JSON.parse('{"url":"", "title":""}');
  }

  deleteAttachment(index: number) {
    if (index > -1) {
      this.attachments.splice(index, 1);
    }
  }

    download(index: number) {
      const files  = [];

      files.push(this.current.attachments[index]);
      this.uploadService.sync(this.type, this.current.id, files)
        .subscribe((mediadata: any) => {
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'  + JSON.stringify(mediadata));
          mediadata.forEach((f: any) => {
            console.log('adding ' + f.title);
            this.current.media.push(f);
          });
        },
        error => {
          this.responsemessage.error = error;
          console.error('post' + error);
      },
        () => {


          console.log('sync complete');
        });

    }

}