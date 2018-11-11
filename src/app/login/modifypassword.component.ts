import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User, Label, RecordType } from 'src/app/_models/index';
import { LoginService, AlertService } from 'src/app/shared';

@Component({
  
  selector: 'app-modifypassword',
  templateUrl: 'modifypassword.component.html',
    styleUrls: ['login.component.css']
})

export class ModifyPasswordComponent implements OnInit {

  @Input() model: any = {};

  @Input() userinfo: any = {};

  loading = false;

  success = false;

  private initUser(): void {

  }

  constructor(private router: Router,
    private authenticationService: LoginService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.initUser();


  }

  modifypassword() {


    if (this.model.newpassword === this.model.newpassword2) {
      this.loading = true;

      this.authenticationService.changepassword(this.model.username, this.model.password, this.model.newpassword, 'none')
        .subscribe(
        data => {
          this.alertService.success('success', true);
          this.loading = false;
          this.authenticationService.logout();
          this.success = true;
          this.userinfo.newpasswordrequired = 'false';

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
    return this.model.newpassword && this.model.newpassword.length >= 10;
  }

  oldIsSecurePassword(): boolean {
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
