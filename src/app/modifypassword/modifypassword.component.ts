import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService } from 'app/_services/index';

import { User, Label, RecordType } from 'app/_models/index';

@Component({
  moduleId: module.id,
  templateUrl: 'modifypassword.component.html',
    styleUrls: ['modifypassword.component.css']
})

export class ModifyPasswordComponent implements OnInit {
  model: any = {};

  currentUser: User;

  loading = false;

  private initUser(): void {

    const currentUserLocalStorage = localStorage.getItem('currentUser');

    if (currentUserLocalStorage) {
      this.currentUser = JSON.parse(currentUserLocalStorage);
      this.currentUser.token = '';
      this.model.email = this.currentUser.email;
      console.log('currentUser ...');

    }

  }

  constructor(private router: Router,
    private userService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.initUser();


  }

  modifypassword() {


    if (this.model.newpassword === this.model.newpassword2) {
      this.loading = true;

      this.userService.changepassword(this.model)
        .subscribe(
        data => {
          this.alertService.success('success', true);
          this.loading = false;
          this.userService.logout();
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
        this.alertService.error('Different passwords !');
    }
  }

  isSecurePassword(): boolean {
    // (?=.*\d)                // should contain at least one digit
    // (?=.*[a-z])             // should contain at least one lower case
    // (?=.*[A-Z])             // should contain at least one upper case
    // [a-zA-Z0-9]{8,}         // should contain at least 8 from the mentioned characters
    // $/);
    return this.model.newpassword && this.model.newpassword.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/));

  }

  canSubmit(): boolean {
    return this.model.newpassword === this.model.newpassword2 && this.isSecurePassword();
  }

}
