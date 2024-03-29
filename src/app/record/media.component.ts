import { Component, OnInit, Input } from '@angular/core';

import { LinkComponent } from './link.component'

@Component({
  
  selector: 'app-media',
  templateUrl: 'media.component.html',
  styleUrls: ['link.component.css', 'media.component.css']
})
export class MediaComponent extends LinkComponent implements OnInit {

  /**
   * object data
   */
   @Input()  id: string = null;


  deleteMedia(index: number) {
    this.log.debug('deleteMedia '  + index + '/' + this.attachments.length);
    this.responsemessage = {};
    const files  = [];

    files.push(this.attachments[index]);
    this.log.debug('deleteMedia '  + JSON.stringify(files));
    this.loading = true;
    this.uploadService.delete(this.type, this.id, files)
      .subscribe((mediadata: any) => {
        this.log.debug('result '  + JSON.stringify(mediadata));
        if (index > -1) {
          this.attachments.splice(index, 1);
        }
      },
      error => {
        this.responsemessage.error = error;
        console.error('post' + error);
        this.loading = false;
    },
      () => {
        this.log.debug('delete complete');
        this.loading = false;
      });
  }

  thumbnails(index: number) {
    this.responsemessage = {};
    const files  = [];
    // const file = JSON.parse('{"url":""}');
    const file: any = {};
    file.url = this.attachments[index].url;
    files.push(file);

    this.loading = true;
    this.uploadService.thumbnails(this.type, this.id, files)
      .subscribe((mediadata: any) => {


        mediadata.forEach((fileAndThumbnails: any) => {
          this.attachments[index].thumbnails = fileAndThumbnails.thumbnails;
          this.log.debug('thumbnails ' + JSON.stringify(this.attachments[index]));
        });
      },
      error => {
        this.responsemessage.error = error;
        console.error('post' + error);
        this.loading = false;
    },
      () => {
        this.log.debug('thumbnails complete');
        this.loading = false;
      });

  }

  getThumbnails(index: number) {
    return this.attachments[index].thumbnails;

  }

    private exists(array: any[], key: any, value: any): boolean {
        let result = false;
        if (array) {
          const filter = array.filter(e => {
              return e[key] === value;
          });
          result = filter.length > 0;
        }

        return result;
    }


      getAttachments(): any[] {
        return this.attachments;
      }

      moveAttachmentUp(index: number) {
        super.moveAttachmentUp(index);
      }

      /**
      * move an attachment downward
      */
      moveAttachmentDown(index: number) {
        super.moveAttachmentDown(index);
      }

      isLoading(): boolean {
        return super.isLoading();
      }

      getResponseMessage(): any {
        return super.getResponseMessage();
      }



      /**
      * TODO usage ?
      */
        refresh() {
          this.uploadService.getFilesDescriptions(this.type, this.id)
            .subscribe((mediadata: any) => {
              if (mediadata.error) {
                  this.openDialog('refresh failed : ' + mediadata.error);
              } else {
                this.log.debug('upload result ' + JSON.stringify(mediadata));
                mediadata.forEach((f: any) => {
                  this.log.debug('-> ' + f.title);
                  const test = this.attachments.filter((e: any) => e.url === f.url);
                  if (test.length === 0) {
                    this.log.debug('adding ' + f.title);
                    this.attachments.push(f);
                  }
                });
              }
            },
            error => {
              this.loading = false;
              this.responsemessage.error = error;
              this.openDialog('Upload error : ' + error);
          },
            () => {
              this.loading = false;
          });
        }
}
