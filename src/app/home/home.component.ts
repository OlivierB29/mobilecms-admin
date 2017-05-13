import { Component, OnInit } from '@angular/core';
import { ContentService, LocaleService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  /*

  https://material.angular.io/components/component/sidenav
  */
  menuMode:  'side';

  /*
  opened
  https://www.npmjs.com/package/@angular2-material/sidenav
  */
  menuOpened: true;

    constructor() {
    }


    ngOnInit() {
      console.log('home component');

    }



}
