
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { User, Label, RecordType } from 'app/_models/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSidenav } from '@angular/material';


import {  ContentService } from 'app/_services';
import { MenuItem } from './menuitem';
import { SendPasswordDialogComponent } from 'app/login';
import { LoginService, LocaleService, AlertService, WindowService } from 'app/shared';

@Component({
  moduleId: module.id,
  selector: 'app-my-mainpage',
  templateUrl: 'mainpage.component.html',
  styleUrls: ['mainpage.component.css', 'login.css']
})
export class MainPageComponent  implements OnInit, AfterViewInit {


    currentUser: User;

    /*
    https://material.angular.io/components/component/sidenav
    */
    menuMode = 'side';

    // mobileLayout = false;

    hasRole = false;

    hasAdminRole = false;

    menuItems: any[] = null;

    adminMenuItems: any[] = null;



    lang: string;

    loading = false;


    model: any = {};

    userinfo: any = {};

    success = false;

    private debug = false;

    @ViewChild('sidenav') sidenav: MatSidenav;



    constructor(protected contentService: ContentService,
       private authenticationService: LoginService,
       private locale: LocaleService, private alertService: AlertService,
       private windowService: WindowService,  public dialog: MatDialog,
       private router: Router, private route: ActivatedRoute) {
         this.debug = true;
         if (this.debug) {

           console.log('!!!!!!!!!!!!!!!!!!!!!!!! initialize ...');
         }
    }



      ngOnInit() {

        if (this.debug) {
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!  ngOnInit ...');
        }
        this.lang = this.locale.getLang();
        this.initLayout();
        this.initUser();
        if (this.isConnected()) {
          if (this.debug) {
          console.log('already connected ...');
          }
          this.loadMenu();
        } else {
          if (this.debug) {
          console.log('logout');
          }
          this.authenticationService.logout();
        }

      }

      ngAfterViewInit() {

        // tricky: if toggle() is called with init, it doesn't work
        if (this.menuMode === 'side') {
          if (this.debug) {
              console.log('toggle menu ...');
          }

          this.sidenav.toggle();
        }
      }


      private initLayout() {

                    let layoutDebugMsg = '';
                    if (this.debug) {
                        layoutDebugMsg += ' default menuMode:' + this.menuMode + ' sidenav.opened:' + this.sidenav.opened;
                    }


                    this.menuMode = 'side';
                    if (this.windowService.isMobile()) {
                        this.menuMode = 'over';
                    }



                    if (this.debug) {
                        layoutDebugMsg += ' => init menuMode:' + this.menuMode + ' sidenav.opened:' + this.sidenav.opened;
                    }

                    if (this.debug) {
                      console.log(layoutDebugMsg);
                    }
      }


          private initUser(): void {

            if (this.debug) {
              console.log('initUser');
            }
            const currentUserLocalStorage = localStorage.getItem('currentUser');

            if (currentUserLocalStorage) {
              if (this.debug) {
                console.log('local storage');
              }
              this.currentUser = JSON.parse(currentUserLocalStorage);
              this.currentUser.token = '';

              this.updatePublicInfoFromLocalStorage(this.currentUser, this.userinfo);

              this.hasAdminRole = this.currentUser.role === 'admin';
              if (this.debug) {
                console.log('currentUser ...' + this.currentUser.role + ' ' + this.currentUser.role);
              }

              this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';

              if (this.debug) {
                console.log('isConnected' + this.isConnected());
                console.log('isAuthenticated' + this.authenticationService.isAuthenticated());
                console.log('isUserExists' + this.isUserExists());
              }
            } else {
              if (this.debug) {
                console.log('no local storage');
              }
            }

          }

          private loadMenu() {
            if (this.debug) {
              console.log('loadMenu ... ');
            }
            this.menuItems = [];

            this.adminMenuItems = [];
            //
            // About roles : this just a frontend features. Roles must be tested in the API.
            //
            if (this.debug) {
              console.log('loadMenu ...' + this.currentUser.role + ' ' + this.hasAdminRole);
            }
            if (this.authenticationService.isAuthenticated() && this.hasRole) {

              let recordTypes: RecordType[] = null;

              this.contentService.getTables().subscribe(users => {
                 recordTypes = users;

                 // iterate each type
                 if (recordTypes) {

                   // record type
                   recordTypes.forEach((record: RecordType) => {
                     record.labels.map((label: Label) => {
                       if (label.i18n === this.lang) {
                         record.label = label.label;
                         return label;
                       }
                     });

                     // create menu from record type
                     const menuItem = new MenuItem();
                     menuItem.routerLink = ['/recordlist', record.type];
                     menuItem.title = record.label;
                     this.menuItems.push(menuItem);

                   });
                 }

                 if (this.hasAdminRole) {
                   const userlist = new MenuItem();
                   userlist.routerLink = ['/userlist'];
                   userlist.title = 'Users';
                   this.adminMenuItems.push(userlist);
                 }

                 if (this.debug) {
                   console.log('loadMenu complete :' + this.menuItems.length);
                 }
               },
               error => {
                 console.error('loadMenu menu failure');
                 this.currentUser = this.authenticationService.resetToken();
                 if (this.debug) {
                   console.log('loadMenu isConnected' + this.isConnected() );
                 }
               },
             () => console.log('loadMenu success'));


            } else {
              if (this.debug) {
                console.log('guest ');
              }
            }



      }



      public isAuthenticated(): boolean {
        return this.authenticationService.isAuthenticated();
      }

      public isConnected(): boolean {
        return this.authenticationService.isAuthenticated() && this.hasRole && !this.isNewPasswordRequired();
      }

      public isUserExists(): boolean {
        return this.userinfo && this.userinfo.name != null;
      }

      public isNewPasswordRequired(): boolean {
        return this.userinfo && this.userinfo.newpasswordrequired === 'true';
      }



      private updatePublicInfoFromLocalStorage(from: any, to: any) {
        to.username = from.username,
        to.email =  from.email,
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
                      if (this.debug) {
                        console.log('newpasswordrequired' + this.userinfo.newpasswordrequired);
                      }

                    } else {
                      console.error('invalid auth token');
                      throw new Error('invalid auth token');
                    }

                      console.log('success');
                      this.initUser();
                      if (this.authenticationService.isAuthenticated()) {
                        this.alertService.success('authenticated');
                        this.loadMenu();
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
                      console.log('error' + JSON.stringify(error));
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
        if (this.debug) {
          console.log('validateuser')
        }

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
            if (this.debug) {
              console.log('validateuser success' + JSON.stringify(this.userinfo))
            }
            if (this.debug) {
              console.log('isConnected' + this.isConnected());
              console.log('isAuthenticated' + this.authenticationService.isAuthenticated());
              console.log('isUserExists' + this.isUserExists());
            }
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
            if (this.debug) {
              console.log('validateuser error')
            }
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
      console.log(`Dialog result: ${result}`);

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
        this.currentUser = null;
        this.hasRole = false;
        this.hasAdminRole = false;
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
}
