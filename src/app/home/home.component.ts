import { Component, OnInit } from '@angular/core';
import { ContentService, LocaleService } from '../_services/index';

import { TranslatePipe } from '@ngx-translate/core';

import { User } from '../_models/index';
import { AuthenticationService } from '../_services/index';



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


    constructor(private authenticationService: AuthenticationService) {

    }

    ngOnInit(): void {
       this.initUser();
    }

    private initUser() {
      const currentUserLocalStorage = localStorage.getItem('currentUser');
      console.log('HomeComponent ...');
      if (currentUserLocalStorage) {
        this.currentUser = JSON.parse(currentUserLocalStorage);
        this.currentUser.token = '';
        console.log('HomeComponent currentUser ...');
      } else {

      }
    }



}
