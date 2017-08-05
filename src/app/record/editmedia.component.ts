import { Component, OnInit } from '@angular/core';

import { EditLinksComponent } from './editlinks.component'

@Component({
  moduleId: module.id,
  selector: 'app-editmedia',
  templateUrl: 'editmedia.component.html',
  styleUrls: ['editlinks.component.css', 'editmedia.component.css']
})
export class EditMediaComponent extends EditLinksComponent implements OnInit {

  deleteMedia(index: number) {
    console.log('deleteMedia '  + index + '/' + this.attachments.length);
    this.responsemessage = {};
    const files  = [];

    files.push(this.attachments[index]);
    console.log('deleteMedia '  + JSON.stringify(files));
    this.loading = true;
    this.uploadService.delete(this.type, this.current.id, files)
      .subscribe((mediadata: any) => {
        console.log('result '  + JSON.stringify(mediadata));
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
        console.log('delete complete');
        this.loading = false;
      });
  }

    upload(files: any) {

      this.responsemessage = {};
      if (files) {
        console.log('files ' + files.length);
        console.log(files);



        for (let i = 0; i < files.length; i++) {
            console.log('uploading  ' + JSON.stringify(files[i]));
            this.loading = true;
            this.uploadService.uploadFile(files[i], this.type, this.current.id)
              .subscribe((mediadata: any) => {
                if (mediadata.error) {
                    this.openDialog('Upload failed : ' + mediadata.error);
                } else {
                  console.log('upload result ' + JSON.stringify(mediadata));
                  mediadata.forEach((f: any) => {
                    console.log('--- current  ' + f.url);
                    if (!this.exists(this.current.media, 'url', f.url)) {
                      console.log('adding ' + f.title);
                      this.current.media.push(f);
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
      } else {
        this.loading = false;
        this.openDialog('No file selected');
      }

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

      refresh() {
        this.uploadService.getFilesDescriptions(this.type, this.current.id)
          .subscribe((mediadata: any) => {
            if (mediadata.error) {
                this.openDialog('refresh failed : ' + mediadata.error);
            } else {
              console.log('upload result ' + JSON.stringify(mediadata));
              mediadata.forEach((f: any) => {
                console.log('-> ' + f.title);
                const test = this.current.media.filter((e: any) => e.url === f.url);
                if (test.length === 0) {
                  console.log('adding ' + f.title);
                  this.current.media.push(f);
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

      open() {
        super.open();
      }

      isDisplay(): boolean {
        return super.isDisplay();
      }

      isLoading(): boolean {
        return super.isLoading();
      }

      getDisplayClass(): string {
        return super.getDisplayClass();
      }

      getResponseMessage(): any {
        return super.getResponseMessage();
      }
}
