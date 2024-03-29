import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './errordialog.component';
import { UploadService } from 'src/app/shared/services';
import { Log } from 'src/app/shared';

@Component({

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
