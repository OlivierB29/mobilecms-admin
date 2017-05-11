﻿import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { ContentService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;


    items: any[] = [];

    hasRole = false;


    constructor( private contentService: ContentService ) {
      //
      //
      //
      const currentUserLocalStorage = localStorage.getItem('currentUser') ;

      if (currentUserLocalStorage) {
        this.currentUser = JSON.parse(currentUserLocalStorage);
      }


    }

    ngOnInit() {
        //
        // About roles : this just a frontend features. Roles must be tested in the API.
        //
        if (this.currentUser.role === 'editor' || this.currentUser.role === 'admin') {
          this.hasRole = true;
          this.contentService.getTables()
              .subscribe((data: any[]) => this.items = data,
              error => console.log('getItems ' + error),
              () => console.log('getItems complete :' + this.items.length));

        } else {

        }

    }
}
