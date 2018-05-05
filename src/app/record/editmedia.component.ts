import { Component, OnInit } from '@angular/core';

import { EditLinksComponent } from './editlinks.component'

@Component({
  moduleId: module.id,
  selector: 'app-editmedia',
  templateUrl: 'editmedia.component.html',
  styleUrls: ['editlinks.component.css', 'editmedia.component.css']
})
export class EditMediaComponent extends EditLinksComponent implements OnInit {



    upload(files: any) {

      this.responsemessage = {};
      if (files) {
        this.log.debug('files ' + files.length);
        this.log.debug(files);



        for (let i = 0; i < files.length; i++) {
            this.log.debug('uploading  ' + JSON.stringify(files[i]));
            this.loading = true;
            this.uploadService.uploadFile(files[i], this.type, this.current.id)
              .then((mediadata: any) => {
                if (mediadata.error) {
                    this.openDialog('Upload failed : ' + mediadata.error);
                } else {
                  this.log.debug('upload result ' + JSON.stringify(mediadata));
                  mediadata.forEach((f: any) => {
                    this.log.debug('--- current  ' + f.url);
                    if (!this.exists(this.current.media, 'url', f.url)) {
                      this.log.debug('adding ' + f.title);
                      this.current.media.push(f);
                    }

                  });
                  this.thumbnails(this.current.media.length - 1);
                }
                this.loading = false;

              },
              error => {
                this.loading = false;
                this.responsemessage.error = error;
                this.openDialog('Upload error : ' + error);
              }
            );
/*
,
error => {
  this.loading = false;
  this.responsemessage.error = error;
  this.openDialog('Upload error : ' + error);
},
() => {
  this.loading = false;
}
*/

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

    thumbnails(index: number) {
      this.responsemessage = {};
      const files  = [];
      // const file = JSON.parse('{"url":""}');
      const file: any = {};
      file.url = this.attachments[index].url;
      files.push(file);

      this.loading = true;
      this.uploadService.thumbnails(this.type, this.current.id, files)
        .subscribe((mediadata: any) => {


          mediadata.forEach((fileAndThumbnails: any) => {
            this.attachments[index].thumbnails = fileAndThumbnails.thumbnails;
            this.log.debug('thumbnails ' + JSON.stringify(this.attachments[index]));
          });
        },
        error => {
          this.responsemessage.error = error;
          console.error('thumbnails ' + error);
          this.loading = false;
      },
        () => {
          this.log.debug('thumbnails complete');
          this.loading = false;
        });

    }

    createThumbnails() {
      this.responsemessage = {};
      const files  = [];

      this.attachments.forEach((attachment: any) => {
        const file: any = {url: attachment.url};
        files.push(file);
      });

      this.log.debug('createThumbnails ' + JSON.stringify(files));

      this.loading = true;
      this.uploadService.thumbnails(this.type, this.current.id, files)
        .subscribe((mediadata: any) => {


          mediadata.forEach((fileAndThumbnails: any) => {
            const attachment = this.getAttachmentByUrl(fileAndThumbnails.url);
            if (attachment) {
              this.log.debug('createThumbnails ' + JSON.stringify(fileAndThumbnails));
              attachment.thumbnails = fileAndThumbnails.thumbnails;
            }  else {
              console.warn('createThumbnails url not found ' + fileAndThumbnails.url);
            }
          });
        },
        error => {
          this.responsemessage.error = error;
          console.error('createThumbnails' + error);
          this.loading = false;
      },
        () => {
          this.log.debug('createThumbnails complete');
          this.loading = false;
        });

    }

      refresh() {
        this.uploadService.getFilesDescriptions(this.type, this.current.id)
          .subscribe((mediadata: any) => {
            if (mediadata.error) {
                this.openDialog('refresh failed : ' + mediadata.error);
            } else {
              this.log.debug('upload result ' + JSON.stringify(mediadata));
              mediadata.forEach((f: any) => {
                this.log.debug('-> ' + f.title);
                const test = this.current.media.filter((e: any) => e.url === f.url);
                if (test.length === 0) {
                  this.log.debug('adding ' + f.title);
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

      getAttachmentByUrl(url: string): any {

        const matched = this.attachments.filter(u => {return u.url === url;});
        return matched.length ? matched[0] : null;
      }


      isLoading(): boolean {
        return super.isLoading();
      }

      getResponseMessage(): any {
        return super.getResponseMessage();
      }

}
