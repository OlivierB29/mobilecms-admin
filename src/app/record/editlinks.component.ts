import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './errordialog.component';
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

  /**
  * list of attachments
  */
  @Input() attachments: any[];



  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;

  loading = false;



    // getAttachments()
    // upload
    // refresh()
    // getResponseMessage()

  constructor(protected uploadService: UploadService, public dialog: MatDialog) { }

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



  addAttachmentBottom() {
    this.attachments.push(this.getDefaultAttachment());
  }

  private getDefaultAttachment(): any {
    // TODO : create a attachment_metadata.json
    return JSON.parse('{"url":"", "title":""}');
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
