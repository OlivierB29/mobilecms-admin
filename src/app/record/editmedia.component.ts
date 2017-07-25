import { Component, OnInit } from '@angular/core';

import { EditLinksComponent } from './editlinks.component'

@Component({
  selector: 'app-editmedia',
  templateUrl: './editmedia.component.html',
  styleUrls: ['./editmedia.component.css']
})
export class EditMediaComponent extends EditLinksComponent implements OnInit {



    upload(files: any) {


      if (files) {
        console.log('files ' + files.length);
        console.log(files);



        for (let i = 0; i < files.length; i++) {
            console.log('uploading  ' + JSON.stringify(files[i]));
            this.uploadService.uploadFile(files[i], this.type, this.current.id)
              .subscribe((mediadata: any[]) => {
                console.log('upload result ' + JSON.stringify(mediadata));
                mediadata.forEach((f: any) => {
                  console.log('adding ' + f.title);
                  this.current.media.push(f);
                });
              },
              error => console.log('upload ' + error),
              () => console.log('upload OK'));


        }
      } else {

        console.log('no files');
      }

    }

}
