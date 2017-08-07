import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { User } from '../_models/index';
import { AuthenticationService } from 'app/_services/index';


/**
* same timing animations
*/
@Component({
  moduleId: module.id,
  selector: 'app-my-topmenu',
  templateUrl: 'topmenu.component.html',
  styleUrls: ['topmenu.component.css']

})

export class TopMenuComponent implements OnInit {



  currentUser: User;


  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.initUser();
  }

  private initUser() {
    const currentUserLocalStorage = localStorage.getItem('currentUser');
    console.log('TopMenuComponent ...');
    if (currentUserLocalStorage) {
      this.currentUser = JSON.parse(currentUserLocalStorage);
      this.currentUser.token = '';

    } else {

    }
  }

}
