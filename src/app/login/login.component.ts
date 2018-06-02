import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User, Label, RecordType } from 'app/_models/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSidenav } from '@angular/material';



import { SendPasswordDialogComponent } from './sendpassworddialog.component';
import { LoginService, LocaleService, AlertService, WindowService, Log } from 'app/shared';
import { environment } from 'environments/environment';
import { SecurityService } from '../shared';



@Component({templateUrl: 'login.component.html',
styleUrls: ['login.css']})
export class LoginComponent implements OnInit {



    lang: string;

    loading = false;

    model: any = {};

    userinfo: any = {};

    success = false;





    constructor(
      protected securityService: SecurityService,
      private authenticationService: LoginService,
      private log: Log,
      private locale: LocaleService, private alertService: AlertService,
      public dialog: MatDialog,
      private router: Router, private route: ActivatedRoute) {}

      ngOnInit() {

        this.log.debug('ngOnInit ...');
        this.lang = this.locale.getLang();

        this.initCurrentUser();
        if (this.securityService.isConnected()) {

          this.log.debug('already connected ...');

          this.loadMenu();
        } else {

          this.log.debug('logout');

          this.authenticationService.logout();
        }

      }






      private initCurrentUser() {

        const currentUser = this.getCurrentUser();
        if (currentUser) {

          this.log.debug('local storage');


          currentUser.token = '';

          this.updatePublicInfoFromLocalStorage(currentUser, this.userinfo);



          this.log.debug('currentUser ...' + currentUser.role);

          this.log.debug('isUserExists' + this.isUserExists());

        } else {

          this.log.debug('no local storage');

        }
      }

      private getCurrentUser(): any {
        let currentUser : any;
        const currentUserLocalStorage = localStorage.getItem('currentUser');
        if (currentUserLocalStorage) {
          currentUser = JSON.parse(currentUserLocalStorage);
        }
        return currentUser;
      }


      private loadMenu() {



        //
        // About roles : this just a frontend feature. Roles must be tested in the API.
        //

        this.log.debug('loadMenu ...');

      }



  

      public isAuthenticated(): Observable<boolean> | boolean {
        return this.securityService.isAuthenticated();
      }

      public isConnected(): Observable<boolean> | boolean {
        return this.securityService.isConnected();
      }


      public isUserExists(): boolean {
        return this.userinfo && this.userinfo.name != null;
      }

      public isNewPasswordRequired(): boolean {
        return this.userinfo && this.userinfo.newpasswordrequired === 'true';
      }



      private updatePublicInfoFromLocalStorage(from: any, to: any) {
        to.username = from.username,
          to.email = from.email,
          to.clientalgorithm = from.clientalgorithm;
      }

      login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password, this.userinfo.clientalgorithm)
          .subscribe(
            userObject => {
              if (userObject && userObject.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                localStorage.setItem('currentUser', JSON.stringify(userObject));
                this.userinfo.newpasswordrequired = userObject.newpasswordrequired;

                  this.log.debug('newpasswordrequired' + this.userinfo.newpasswordrequired);


              } else {
                console.error('invalid auth token');
                throw new Error('invalid auth token');
              }

              this.log.debug('success');
              this.initCurrentUser();
              if (this.securityService.isAuthenticated()) {
                this.alertService.success('authenticated');
                this.loadMenu();
                this.router.navigate(['']);
              } else {
                this.alertService.error('empty user');
              }


              this.loading = false;
              // ensure clear password
              if (!this.isNewPasswordRequired()) {
                this.clearPassword();
              }

            },
            error => {
              this.log.debug('error' + JSON.stringify(error));
              this.alertService.error('not connected');
              this.loading = false;
            });
      }

      private sendpassword() {



        this.loading = true;

        this.authenticationService.resetpassword(this.model.username)
          .subscribe(
            data => {
              this.alertService.success('success', true);
              this.loading = false;
              this.userinfo = data;
              this.clearPassword();


            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });

      }

      validateuser() {

          this.log.debug('validateuser')

        this.loading = true;
        /*
                this.http.get<any>(this.authenticationService.publicinfoUrl(this.model.username))
                .subscribe(
                (data: any) => {
                  this.userinfo = data;
                  this.alertService.success('success', true);
                  this.loading = false;

                },
                error => {
                  this.alertService.error(error);
                  this.loading = false;
                });*/

        this.authenticationService.publicinfo(this.model.username)
          .subscribe(
            (data: any) => {
              this.userinfo = data;
              this.alertService.success('success', true);
              this.loading = false;

                this.log.debug('validateuser success' + JSON.stringify(this.userinfo))


                this.log.debug('isAuthenticated' + this.securityService.isAuthenticated());
                this.log.debug('isUserExists' + this.isUserExists());

            },
            error => {
              this.alertService.error(error);
              this.loading = false;

                this.log.debug('validateuser error')

            });
      }

      /**
      * delete
      */
      openSendPassword() {

        const dialogRef = this.dialog.open(SendPasswordDialogComponent, {
          data: this.model.username,
        });

        dialogRef.afterClosed().subscribe(result => {
          this.log.debug(`Dialog result: ${result}`);

          if (result) {
            this.sendpassword();
          }
        });

      }


      clearPassword() {
        this.model.password = '';
      }

      clearNewPassword() {
        this.model.newpassword = '';
      }


      disconnect() {

        this.authenticationService.logout();
        this.userinfo = {};
        this.model = {};
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
                this.userinfo = data;
                this.clearPassword();
                this.clearNewPassword();
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

      isSecurePasswordV2(): boolean {
        // (?=.*\d)                // should contain at least one digit
        // (?=.*[a-z])             // should contain at least one lower case
        // (?=.*[A-Z])             // should contain at least one upper case
        // [a-zA-Z0-9]{8,}         // should contain at least 8 from the mentioned characters
        // $/);
        return this.model.newpassword && this.model.newpassword.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}$/));

      }

      canSubmit(): boolean {
        return this.model.newpassword === this.model.newpassword2 && this.isSecurePassword();
      }

      /**
       * About roles : this just a frontend feature. Role must be tested in the API.
       */
      isAdminRole(): boolean {
        return this.securityService.isAdminRole();
      }

      hasRole(): boolean {
        return this.securityService.hasRole();
      }
}
