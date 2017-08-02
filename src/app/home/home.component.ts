import { Component, OnInit } from '@angular/core';
import { ContentService, LocaleService } from '../_services/index';
import { MdDialog } from '@angular/material';


import { TranslatePipe } from '@ngx-translate/core';

import { User } from '../_models/index';
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


    constructor(private authenticationService: AuthenticationService, public dialog: MdDialog) {

    }

    ngOnInit(): void {
       this.currentUser = this.authenticationService.initUser();
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


}
