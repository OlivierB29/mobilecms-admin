import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './errordialog.component';
import { UploadService } from 'app/shared/services';
import { Log } from 'app/shared';

@Component({
  moduleId: module.id,
  selector: 'app-link',
  templateUrl: 'link.component.html',
  styleUrls: ['link.component.css']
})
export class LinkComponent implements OnInit {
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

  /**
  * list of attachments
  */
  @Input() attachments: any[];

  @Input() index: number;


  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;

  loading = false;

  displayDetails = false;


  constructor(protected log: Log, protected uploadService: UploadService, public dialog: MatDialog) { }

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
    if (!this.attachments[this.index].title) {
      this.displayDetails = true;
    }
  }



  // <!--
  // attachments
  // moveAttachmentUp
  //
  //
  // moveAttachmentDown
  // deleteAttachment
  //
  // download
  //
  // -->


  /**
  * add an attachment at the beginning
  */
  addAttachmentTop() {

  this.attachments.push(this.getDefaultAttachment());
  this.attachments = this.move(this.attachments, this.attachments.length - 1, 0);
  }

  addAttachmentBottom() {
    this.attachments.push(this.getDefaultAttachment());
  }

  toggleDisplayDetails() {
    this.displayDetails = !this.displayDetails;
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
      this.responsemessage = {};
      const files  = [];

      files.push(this.attachments[index]);
      this.log.debug('files '  + files);
      this.loading = true;
      this.uploadService.sync(this.type, this.current.id, files)
        .subscribe((mediadata: any) => {
          this.log.debug('result '  + JSON.stringify(mediadata));
          mediadata.forEach((f: any) => {
            this.log.debug('adding ' + f.title);
            this.current.media.push(f);
          });
        },
        error => {
          this.responsemessage.error = error;
          console.error('post' + error);
          this.loading = false;
      },
        () => {
          this.log.debug('sync complete');
          this.loading = false;
        });

    }



    openDialog(msg: string) {
      this.dialog.open(ErrorDialogComponent, {
         data: msg,
      });
    }

    isLoading(): boolean {
      return this.loading;
    }

    getResponseMessage(): string {
      return this.responsemessage;
    }


}
