import { Component, OnInit } from '@angular/core';

import { User, Label, RecordType } from 'app/_models/index';
import { LocaleService } from 'app/_services/index';


export class StandardComponent  implements OnInit  {

  currentUser: User;


  hasRole = false;

  hasAdminRole = false;

  menuItems: RecordType[] = null;

  lang: string;

  ngOnInit() {

    this.initUser();
  }


      constructor() {

      }



      private initUser(): void {

        const currentUserLocalStorage = localStorage.getItem('currentUser');

        if (currentUserLocalStorage) {
          this.currentUser = JSON.parse(currentUserLocalStorage);
          this.currentUser.token = '';

          this.hasAdminRole = this.currentUser.role === 'admin';
          console.log('currentUser ...' + this.currentUser.role + ' ' + this.hasAdminRole);

          this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
        }

      }


}
