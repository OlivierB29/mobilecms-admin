import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { TranslatePipe } from '@ngx-translate/core';

import { User, Label, RecordType, Metadata } from 'app/_models';

import { ContentService, UploadService, } from 'app/_services';
import { StringUtils, LocaleService, WindowService } from 'app/shared';
import { StandardComponent } from 'app/home';

import { environment } from 'environments/environment';
import { DeleteDialogComponent } from './deletedialog.component';
import { RecordHelpDialogComponent } from './recordhelpdialog.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  templateUrl: 'record.component.html',
  styleUrls: ['record.component.css']
})

export class RecordComponent extends StandardComponent implements OnInit, OnDestroy {

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
  properties: Metadata[];


  /**
   * response on save
   */
  response: any = null;

  /**
  * if new record, not saved on backend
  */
  newrecord = false;



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

  constructor(protected contentService: ContentService,

    locale: LocaleService,
    private route: ActivatedRoute, private router: Router,
    private windowService: WindowService, public dialog: MatDialog,
    private uploadService: UploadService, private stringUtils: StringUtils) {
    super();
  }


  ngOnDestroy() {
    console.log('Destroy timer');
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
    super.ngOnInit();
    console.log('record.component');

    this.route.params.forEach((params: Params) => {

      this.type = params['type'];

      this.id = params['id'];

      console.log('edit:' + this.type + ' id:' + this.id);

      if (this.type) {
        // read metadata of record

        this.contentService.getMetadata(this.type + '/index/metadata.json')
          .subscribe((data: any[]) => { this.properties = data; },
          error => console.log('loadMetadata ' + error),
          () => console.log('loadMetadata OK'));
      }

      if (this.id && this.id !== 'new') {



        // read record content
        this.contentService.getRecord(this.type, this.id)
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
                console.log('init media ');
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
            console.log('get complete' + JSON.stringify(this.current));
          });
      } else {
        console.log('editcalendar-form empty id');
        this.loading = true;

        this.newrecord = true;

        this.contentService.getNewRecord(this.type + '/index/new.json')
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
            console.log('getNewRecord ' + error);
          },
          () => {
            this.loading = false;
            console.log('getNewRecord OK');
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

  save() {
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
        const timestamp = Number.parseInt(this.response.timestamp) * 1000;

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


        console.log('post complete');
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
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.delete();
      }
    });

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


        console.log('delete complete');
      });

  }

  /**
  * help
  */
  openHelpDialog() {
    const dialogRef = this.dialog.open(RecordHelpDialogComponent, {
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => { console.log('Dialog result'); });
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



}
