import { Component, OnInit } from '@angular/core';

import { User, Label, RecordType } from 'app/_models/index';

import { LocaleService, Log } from 'app/shared';

export class StandardComponent implements OnInit {

  currentUser: User;


  hasRole = false;

  hasAdminRole = false;

  menuItems: RecordType[] = null;

  lang: string;

  ngOnInit() {

    this.initUser();
  }
  constructor(protected log: Log) {
  }



  private initUser(): void {

    const currentUserLocalStorage = localStorage.getItem('currentUser');

    if (currentUserLocalStorage) {
      this.currentUser = JSON.parse(currentUserLocalStorage);
      this.currentUser.token = '';

      this.hasAdminRole = this.currentUser.role === 'admin';
      this.log.debug('currentUser ...' + this.currentUser.role + ' ' + this.hasAdminRole);

      this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
    }

  }


  public isAdminRole(): boolean {
    return this.hasAdminRole;
  }

}
