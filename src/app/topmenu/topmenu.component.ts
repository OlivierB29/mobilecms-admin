import { Component, OnInit } from '@angular/core';


import { User } from '../_models/index';
import { AuthenticationService } from '../_services/index';


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


  constructor(private authenticationService: AuthenticationService) {
  }

ngOnInit(): void {
  const currentUserLocalStorage = localStorage.getItem('currentUser') ;
    console.log('TopMenuComponent ...');
  if (currentUserLocalStorage) {
    this.currentUser = JSON.parse(currentUserLocalStorage);
    console.log('currentUser ...');
  } else {
    console.log('logout !!!!');
    // reset login status
    this.authenticationService.logout();
  }
}

}
