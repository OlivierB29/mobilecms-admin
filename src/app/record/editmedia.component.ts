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
                    console.log('adding ' + f.title);
                    this.current.media.push(f);
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

}
