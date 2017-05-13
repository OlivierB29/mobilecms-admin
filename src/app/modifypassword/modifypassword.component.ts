import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services/index';

import { User, Label, RecordType } from '../_models/index';

@Component({
  moduleId: module.id,
  templateUrl: 'modifypassword.component.html'
})

export class ModifyPasswordComponent {
  model: any = {};

  currentUser: User;

  loading = false;

  private initUser(): void {

    const currentUserLocalStorage = localStorage.getItem('currentUser');

    if (currentUserLocalStorage) {
      this.currentUser = JSON.parse(currentUserLocalStorage);
      this.currentUser.token = '';
      console.log('currentUser ...');

    }

  }

  constructor(private router: Router,
    private userService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.initUser();

    this.model.email = this.currentUser.email;
  }

  modifypassword() {


    if (this.model.newpassword === this.model.newpassword2) {
      this.loading = true;
      this.userService.changepasssword(this.model)
        .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
        alert('Different passwords !');
        this.alertService.error('!!!');
    }



  }
}
