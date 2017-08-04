import { Component, OnInit } from '@angular/core';
import { ContentService, LocaleService } from '../_services/index';
import { MdDialog } from '@angular/material';


import { TranslatePipe } from '@ngx-translate/core';
import { User, Label, RecordType } from '../_models/index';
import { AuthenticationService } from '../_services/index';
import { HomeHelpDialogComponent } from './homehelpdialog.component';


@Component({
    moduleId: module.id,
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  currentUser: User;


  /*

  https://material.angular.io/components/component/sidenav
  */
  menuMode:  'side';

  /*
  opened
  https://www.npmjs.com/package/@angular2-material/sidenav
  */
  menuOpened: true;

  hasRole = false;

  hasAdminRole = false;

  menuItems: RecordType[] = null;

  lang: string;




    constructor(private contentService: ContentService,
       private authenticationService: AuthenticationService,
       private locale: LocaleService,
       public dialog: MdDialog) {

    }


      ngOnInit() {

        this.lang = this.locale.getLang();

        this.initUser();

        this.initMenu();

      }


    /**
    * help
    */
    openHelpDialog() {
      const dialogRef = this.dialog.open(HomeHelpDialogComponent, {
         data: '',
      });
      dialogRef.afterClosed().subscribe(result => { console.log('Dialog result'); });
    }


    private initUser(): void {

      const currentUserLocalStorage = localStorage.getItem('currentUser');

      if (currentUserLocalStorage) {
        this.currentUser = JSON.parse(currentUserLocalStorage);
        this.currentUser.token = '';
        console.log('currentUser ...');

        this.hasAdminRole = this.currentUser.role === 'admin';
        this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
      }

    }

    private initMenu() {
      //
      // About roles : this just a frontend features. Roles must be tested in the API.
      //

      if (this.hasRole) {
        this.contentService.getTables()
          .subscribe((data: RecordType[]) => this.menuItems = data,
          error => console.log('getItems ' + error),
          () => {
            console.log('getItems complete :' + this.menuItems.length);

            // iterate each type
            if (this.menuItems) {

              this.menuItems.forEach((record: RecordType) => {
                // detect label value
                record.labels.map((label: Label) => {
                  if (label.i18n === this.lang) {
                    record.label = label.label;
                    return label;
                  }
                });



              });
            }
          });


      } else {
        console.log('guest ');
      }


}
}
