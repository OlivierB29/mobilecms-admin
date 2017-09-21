
import { Component, OnInit } from '@angular/core';
import { User, Label, RecordType } from 'app/_models/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdDialog } from '@angular/material';


import { AlertService, AuthenticationService, ContentService, LocaleService } from 'app/_services';
import { MenuItem } from './menuitem';
import { SendPasswordDialogComponent } from 'app/login';

@Component({
  moduleId: module.id,
  selector: 'app-my-mainpage',
  templateUrl: 'mainpage.component.html',
  styleUrls: ['mainpage.component.css']
})
export class MainPageComponent  implements OnInit {


    currentUser: User;


    /*

    https://material.angular.io/components/component/sidenav
    */
    menuMode = 'side';

    /*
    opened
    https://www.npmjs.com/package/@angular2-material/sidenav
    */
    menuOpened = true;

    mobileLayout = true;

    hasRole = false;

    hasAdminRole = false;

    menuItems: any[] = null;

    adminMenuItems: any[] = null;



    lang: string;

    loading = false;


    model: any = {};

    userinfo: any = {};

    success = false;

    constructor(protected contentService: ContentService,
       private authenticationService: AuthenticationService,
       private locale: LocaleService, private alertService: AlertService,
        public dialog: MdDialog,
       private router: Router, private route: ActivatedRoute) {

    }

      ngOnInit() {
        this.lang = this.locale.getLang();

        this.initUser();
        if (this.isConnected()) {
          this.initUi();
        } else {
          console.log('logout');
          this.authenticationService.logout();
        }

      }





      private initUi() {

        this.initMenuLayout();
        this.initMenu();
      }


          private initMenuLayout(): void {
            // const layout = this.conf.getLayout();
            const layout = this.getLayout();

            this.mobileLayout = layout !== 'desktop';

             switch (layout)  {
            case 'desktop':
               this.menuMode = 'side';
               this.menuOpened = true;
              break;
            default:
               this.menuMode = 'over';
               this.menuOpened = false;
            }

          }

          private initUser(): void {


            const currentUserLocalStorage = localStorage.getItem('currentUser');

            if (currentUserLocalStorage) {
              this.currentUser = JSON.parse(currentUserLocalStorage);
              this.currentUser.token = '';

              this.hasAdminRole = this.currentUser.role === 'admin';
              console.log('currentUser ...' + this.currentUser.role + ' ' + this.currentUser.role);
              this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
            }

          }

          private initMenu() {
            this.menuItems = [];

            this.adminMenuItems = [];
            //
            // About roles : this just a frontend features. Roles must be tested in the API.
            //
            console.log('initMenu ...' + this.currentUser.role + ' ' + this.hasAdminRole);
            if (this.isAuthenticated() && this.hasRole) {

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


                 console.log('menu complete :' + this.menuItems.length);
                });


            } else {
              console.log('guest ');
            }


      }

      getLayout(): string {

        let layout = 'desktop';

        if (window.matchMedia('(min-width: 55em)').matches) {
          layout = 'desktop';
        } else {
          layout = 'mobile';
        }
        return layout;
      }

      public isAuthenticated(): boolean {
        return localStorage.getItem('currentUser') != null;
      }

      public isConnected(): boolean {
        return this.isAuthenticated() && this.hasRole && !this.isNewPasswordRequired();
      }

      public isUserExists(): boolean {
        return this.userinfo && this.userinfo.name != null;
      }

      public isNewPasswordRequired(): boolean {
        return this.userinfo && this.userinfo.newpasswordrequired === 'true';
      }

      login() {
          this.loading = true;
          this.authenticationService.login(this.model.username, this.model.password, this.userinfo.clientalgorithm)
              .subscribe(
                  userObject => {
                    if (userObject && userObject.token) {
                      // store user details and jwt token in local storage to keep user logged in between page refreshes

                      localStorage.setItem('currentUser', JSON.stringify(userObject));
                    } else {
                      console.error('invalid auth token');
                      throw new Error('invalid auth token');
                    }

                      console.log('success');
                      this.initUser();
                      if (this.isAuthenticated()) {
                        this.alertService.success('authenticated');
                        this.initUi();
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
        console.log('validateemail');
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

          },
          error => {
            this.alertService.error(error);
            this.loading = false;
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
