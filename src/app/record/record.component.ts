import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from 'src/app/_models';

import { ContentService, UploadService } from 'src/app/shared/services';
import { StringUtils, LocaleService, WindowService } from 'src/app/shared';


import { environment } from 'src/environments/environment';
import { DeleteDialogComponent } from './deletedialog.component';
import { RecordHelpDialogComponent } from './recordhelpdialog.component';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Log } from 'src/app/shared';
import { ErrorDialogComponent } from './errordialog.component';
import { BBCodeURLDialogComponent } from './bbcodeurldialog.component';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import * as Editor from '@ckeditor/ckeditor5-angular';


@Component({

  templateUrl: 'record.component.html',
  styleUrls: ['record.component.css']
})

export class RecordComponent  implements OnInit, OnDestroy {


  public Editor = ClassicEditor;


  i18n = {};

  /**
   * current type : news, calendar, ...
   */
  type = '';

  /**
   * object id
   */
  id = '';

  /**
   * object data
   */
  current: any = null;


  files: any[] = null;


  /**
   * object metadata
   */
  properties: any[];


  /**
   * response on save
   */
  response: any = null;

  /**
  * new record = not saved on backend
  */
  newrecord = false;

  /**
   * bbcode url result
   */
  dialogresult = {};

  /**
  * properties :
  * error
  * savedate
  * since
  */
  responsemessage: any;

  /**
  * enable timer for autosave
  *
  * Issue: when typing text in description, the focus is lost
  */
  private enableTimer = false;

  /**
  * timer
  */
  private timer: Observable<number>;
  /**
  * Subscription object
  */
  private timerSub: Subscription;

  /**
  * last save
  */
  private lastSaveDate: Date = null;

  /**
  * previous record data
  */
  private previous: any = null;

  /**
  * if a service is loading
  */
  loading = false;

  /**
  * tick rate to launch autosave
  */
  private timerTickRate = 15000;

  /**
  * last time between to save.
  * Use case: when a manual save is done
  */
  private autosaveDelay = 15000;


  constructor(private log: Log,
    protected contentService: ContentService,

    locale: LocaleService,
    private route: ActivatedRoute, private router: Router,
    private windowService: WindowService, public dialog: MatDialog,
    private uploadService: UploadService,
     private stringUtils: StringUtils) {



  }


  ngOnDestroy() {
    this.log.debug('Destroy timer');
    // unsubscribe here
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }

  }

  getLayout(): string {
    return this.windowService.getLayout();
  }


  ngOnInit() {

    

    this.loading = true;

    this.log.debug('record.component');

    this.route.params.forEach((params: Params) => {

      this.type = params['type'];

      this.id = params['id'];

      this.log.debug('edit:' + this.type + ' id:' + this.id);

      if (this.type) {
        // read metadata of record

        this.contentService.getMetadata(this.type)
          .subscribe((data: any[]) => { this.properties = data; },
          error => this.log.debug('loadMetadata ' + error),
          () => this.log.debug('loadMetadata OK ' + this.properties));
      }

      if (this.id && this.id !== 'new') {



        // read record content
        this.contentService.getRecord(this.type, this.id)
          .subscribe((data: any) => {
            this.current = data;

            if (this.current) {

              if (!this.current.format) {
                this.current.format = 'html';
              }

              if (!this.current.images) {
                this.current.images = [];
              }

              if (!this.current.attachments) {
                this.current.attachments = [];
              }


              if (!this.current.media) {
                this.log.debug('init media ');
                this.current.media = [];
              }

              // old date format converter. yyyyMMdd -> yyyy-MM-dd
              if (this.current.date) {
                const oldDate = this.stringUtils.parseOldDate(this.current.date);
                if (oldDate) {
                  this.current.date = oldDate;
                }
              }

              this.previous = JSON.parse(JSON.stringify(this.current));

            }
          },
          error => {
            this.loading = false;
            console.error('get' + JSON.stringify(error));
          },
          () => {
            this.loading = false;
            this.log.debug('get complete' + JSON.stringify(this.current));
          });
      } else {
        this.log.debug('editcalendar-form empty id');
        this.loading = true;

        this.newrecord = true;

        this.contentService.getNewRecord(this.type)
          .subscribe((data: any) => {
            this.current = data;

            if (this.current) {
              if (!this.current.images) {
                this.current.images = [];
              }

              if (!this.current.attachments) {
                this.current.attachments = [];
              }

              if (!this.current.media) {
                this.current.media = [];
              }
            }
          },
          error => {
            this.loading = false;
            this.log.debug('getNewRecord ' + error);
          },
          () => {
            this.loading = false;
            this.log.debug('getNewRecord OK');
          });
      }



    });

    // autosave feature
    if (!this.newrecord) {
      this.lastSaveDate = new Date();
    } else {
      this.lastSaveDate = null;
    }
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }

    // issue : error TS2339: Property 'timer' does not exist on type 'typeof Observable'.
    // if (this.enableTimer) {
    //   this.timer = Observable.timer(this.timerTickRate, this.timerTickRate);
    //   // subscribing to a observable returns a subscription object
    //   this.timerSub = this.timer.subscribe(t => this.tickerFunc(t));
    // }


  }


  isAutosaveReady() {
    // TODO : form valid ? (date, title attachments, ...)
    return !this.newrecord && this.isModified() && !this.loading;
  }

  autosave() {

    if (this.isAutosaveReady()) {
      this.save();
    }
  }

  publish() {
    this.current.status = 'published';
    this.save();
  }

  save() {

    console.log(this.current.description);

    const timestamp = new Date().getTime();
    this.loading = true;
    this.responsemessage = {};
    this.generateId();
    this.previous = JSON.parse(JSON.stringify(this.current));
    this.contentService.post(this.type, this.current)
      .subscribe((data: any) => {
        this.response = data;

      },
      error => {
        this.loading = false;
        this.responsemessage.error = JSON.stringify(error);

      },
      () => {
        this.loading = false;
        // calculate diff from PHP time https://stackoverflow.com/questions/13022524/javascript-time-to-php-time
        // const timestamp = Number.parseInt(this.response.timestamp) * 1000;


        // savedate
        this.lastSaveDate = new Date();
        this.lastSaveDate.setTime(timestamp);
        this.responsemessage.savedate = this.lastSaveDate.toLocaleDateString() + ' ' + this.lastSaveDate.toLocaleTimeString();

        // time since save
        const diffMilli = new Date().getTime() - timestamp;
        if (diffMilli < 1000) {
          this.responsemessage.since = '< 1s';
        } else {
          this.responsemessage.since = (diffMilli / 1000).toString();
        }

        // forward to record modification page
        if (this.newrecord) {
          this.router.navigate(['/record', this.type, this.current.id]);
        }

        // record is now saved
        if (this.newrecord) {
          this.newrecord = false;
        }

        this.log.debug('post complete');
      });

  }

  /**
  * Generate id from title.
  * Use case : each event is unique. Such as : 28 oct 2017 - tournament at Some City
  */
  generateId() {
    if (this.newrecord) {
      // replace accents by US ASCII
      let newId = '';

      if (this.current.date) {
        newId += new Date(this.current.date).getFullYear().toString() + '_' ; // weird issue when using '-'
      }

      newId += this.stringUtils.removeDiacritics(this.current.title);

      // remove all remaining special characters
      newId = newId.replace(/[^\w\s]/gi, '');

      // replace space by '-'
      newId = newId.replace(/\s/g, '-');

      newId = newId.replace('_', '-');

      // too much space
      while (newId.indexOf('--') > -1) {
        newId = newId.replace('--', '-');
      }

      this.current.id = newId;
    }

  }



  preview() {
    this.generateId();
    const url = environment.website + '/' + this.type + '/' + this.id;
    window.open(url, '_blank');
  }

  /**
  * delete
  */
  openConfirmDialog() {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: this.current.title,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.log.debug(`Dialog result: ${result}`);

      if (result) {
        this.delete();
      }
    });

  }

  newbbcodeurl(descriptiontext: any) {
    this.addBBCode(descriptiontext, '[url="https://test.org"]', '[/url]');
  }

  newbbcodeurl2(descriptiontext: any) {
    this.openBBCodeDialog(descriptiontext);
  }

  newbbcodebold(descriptiontext: any) {
    this.addBBCode(descriptiontext, '[b]', '[/b]');
  }

  newbbcodeitalic(descriptiontext: any) {
    this.addBBCode(descriptiontext, '[i]', '[/i]');
  }

  newbbcodeunderline(descriptiontext: any) {
    this.addBBCode(descriptiontext, '[u]', '[/u]');
  }

  private addBBCode(descriptiontext: any, bbtag1 : string, bbtag2 : string){

    // test if not null
    if (descriptiontext && descriptiontext.selectionStart && descriptiontext.selectionEnd) {
      // selected text
      if (descriptiontext.selectionStart === descriptiontext.selectionEnd) {
        this.current.description = this.current.description.substring(0, descriptiontext.selectionStart) + bbtag1 + bbtag2 + this.current.description.substring(descriptiontext.selectionStart, this.current.description.length);
      } else {
        this.current.description = this.current.description.substring(0, descriptiontext.selectionStart)
        + bbtag1
        + this.current.description.substring(descriptiontext.selectionStart, descriptiontext.selectionEnd)
        + bbtag2
        + this.current.description.substring(descriptiontext.selectionEnd, this.current.description.length);
      }
    } else {
      // default behavior : end of text
      this.current.description += bbtag1 + bbtag2;
    }

  }

  private appendBBCodeWithTitle(descriptiontext: any, bbtag1 : string, bbtag2 : string, title: string){
   // test if not null
   if (descriptiontext && descriptiontext.selectionStart && descriptiontext.selectionEnd) {
    // selected text
    if (descriptiontext.selectionStart === descriptiontext.selectionEnd) {
      this.current.description = this.current.description.substring(0, descriptiontext.selectionStart) + bbtag1 + title + bbtag2 + this.current.description.substring(descriptiontext.selectionStart, this.current.description.length);
    } else {
      this.current.description = this.current.description.substring(0, descriptiontext.selectionStart)
      + bbtag1
      + title
      + bbtag2
      + this.current.description.substring(descriptiontext.selectionEnd, this.current.description.length);
    }
  } else {
    // default behavior : end of text
    this.current.description += bbtag1 + title + bbtag2;
  }


  }

  /**
  * must click on dialog first
  */
  private delete() {

    this.contentService.delete(this.type, this.current.id)
      .subscribe((data: any) => this.response = JSON.stringify(data),
      error => console.error('delete ' + error),
      () => {

        // forward to record modification page
        this.router.navigate(['/recordlist', this.type]);


        this.log.debug('delete complete');
      });

  }

  /**
  * help
  */
  openHelpDialog() {
    const dialogRef = this.dialog.open(RecordHelpDialogComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => { this.log.debug('Dialog result'); });
  }


  tickerFunc(t: number) {

    if (this.isAutosaveReady() && this.lastSaveDate && (new Date().getTime() - this.lastSaveDate.getTime()) > this.autosaveDelay) {
      this.autosave();
    }

  }



  /**
  * if current record is modified since last save
  */
  isModified() {
    return this.previous !== null && JSON.stringify(this.previous) !== JSON.stringify(this.current);
  }


  isDisplayDraft() {

    return  this.current && this.current.status && 'draft' === this.current.status;
  }

  /**
   * When the first date is modified, initialize all dates with the same initial value.
   *
   * Example : on a calendar event, the default end date is the same as the start date.
   *
   * @param property modified property
   */
  copyToEmptyDatesFields(property: any) {
    if (this.newrecord) {
      // get all date fields
      const dateFields = this.properties.filter(u => { return u.editor === 'date'; });
      // several dates on the record
      if (dateFields.length > 1) {
        dateFields.forEach(item => {
          if (item.name !== property.name && !this.current[item.name] ) {
            this.current[item.name] = this.current[property.name] ;
          }
        });

      }

    }

  }

  /**
   * Overwrite other dates with the current date
   * @param property  modified property
   */
  overwriteDates(property: any) {
      // get all date fields
      const dateFields = this.properties.filter(u => { return u.editor === 'date'; });
      // several dates on the record
      if (dateFields.length > 1) {
        dateFields.forEach(item => {
          if (item.name !== property.name) {
            this.current[item.name] = this.current[property.name] ;
          }
        });

      }



  }

  clone() {
    this.current.id = null;
    this.newrecord = true;

    if (!this.current.media) {
      this.current.media = [];
    }

  }

  isLoading(): boolean {
    return this.loading;
  }


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


  openDialog(msg: string) {
    this.dialog.open(ErrorDialogComponent, {
       data: msg,
    });
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
  file.url = this.current.media[index].url;
  files.push(file);

  this.loading = true;
  this.uploadService.thumbnails(this.type, this.current.id, files)
    .subscribe((mediadata: any) => {


      mediadata.forEach((fileAndThumbnails: any) => {
        this.current.media[index].thumbnails = fileAndThumbnails.thumbnails;
        this.log.debug('thumbnails ' + JSON.stringify(this.current.media[index]));
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

getResponseMessage(): any {
  return this.responsemessage;
}


  /**
  * delete
  */
 openBBCodeDialog(descriptiontext: any) {

   this.dialogresult = { bbcodeurl : 'https://test.org', bbcodetitle: 'test', usebbcodetitle: true };

  const dialogRef = this.dialog.open(BBCodeURLDialogComponent, {
    data: this.dialogresult,
  });

  dialogRef.afterClosed().subscribe(result => {
    // get popup result
    this.log.debug(`Dialog result: ${result.bbcodeurl} ${result.bbcodetitle}`);

    // alter text
    this.appendBBCodeWithTitle(descriptiontext, '[url=\"'+result.bbcodeurl+'\"]', '[/url]', result.bbcodetitle);
  });

}

}
