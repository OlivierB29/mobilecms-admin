
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User, Label, RecordType } from 'app/_models/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSidenav } from '@angular/material';


import { ContentService } from 'app/_services';
import { MenuItem } from './menuitem';
import { SendPasswordDialogComponent } from 'app/login';
import { LoginService, LocaleService, AlertService, WindowService, Log } from 'app/shared';
import { environment } from 'environments/environment';


@Component({
  moduleId: module.id,
  selector: 'app-my-mainpage',
  templateUrl: 'mainpage.component.html',
  styleUrls: ['mainpage.component.css', 'login.css']
})
export class MainPageComponent implements OnInit, AfterViewInit {


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



  home: MenuItem;

  @ViewChild('sidenav') sidenav: MatSidenav;



  constructor(protected contentService: ContentService,
    private authenticationService: LoginService,
    private log: Log,
    private locale: LocaleService, private alertService: AlertService,
    private windowService: WindowService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {

    this.log.debug('initialize ...');
  }



  ngOnInit() {

    this.log.debug('ngOnInit ...');
    this.lang = this.locale.getLang();
    this.initLayout();
    this.initUser();
    if (this.isConnected()) {

      this.log.debug('already connected ...');

      this.loadMenu();
    } else {

      this.log.debug('logout');

      this.authenticationService.logout();
    }

    this.home = new MenuItem();
    this.home.url = environment.website;
    this.home.label = 'site.label';
  }

  ngAfterViewInit() {
    // tricky: if toggle() is called with init, it doesn't work
    if (this.menuMode === 'side') {

      this.log.debug('toggle menu ...');


      this.sidenav.toggle();
    }
    this.cdr.detectChanges();
  }


  private initLayout() {

    let layoutDebugMsg = '';

    layoutDebugMsg += 'default menuMode:' + this.menuMode + 'sidenav.opened:' + this.sidenav.opened;



    this.menuMode = 'side';
    if (this.windowService.isMobile()) {
      this.menuMode = 'over';
    }

    layoutDebugMsg += '=> init menuMode:' + this.menuMode + 'sidenav.opened:' + this.sidenav.opened;

    this.log.debug(layoutDebugMsg);

  }


  private initUser(): void {

    this.log.debug('initUser');

    const currentUserLocalStorage = localStorage.getItem('currentUser');

    if (currentUserLocalStorage) {

      this.log.debug('local storage');

      this.currentUser = JSON.parse(currentUserLocalStorage);
      this.currentUser.token = '';

      this.updatePublicInfoFromLocalStorage(this.currentUser, this.userinfo);

      this.hasAdminRole = this.currentUser.role === 'admin';

      this.log.debug('currentUser ...' + this.currentUser.role + '' + this.currentUser.role);


      this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';


      this.log.debug('isConnected' + this.isConnected());
      this.log.debug('isAuthenticated' + this.authenticationService.isAuthenticated());
      this.log.debug('isUserExists' + this.isUserExists());

    } else {

      this.log.debug('no local storage');

    }

  }

  private loadMenu() {

    this.log.debug('loadMenu ... ');

    this.menuItems = [];

    this.adminMenuItems = [];
    //
    // About roles : this just a frontend features. Roles must be tested in the API.
    //

    this.log.debug('loadMenu ...' + this.currentUser.role + '' + this.hasAdminRole);

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


        this.log.debug('loadMenu complete :' + this.menuItems.length);

      },
        error => {
          console.error('loadMenu menu failure');
          this.currentUser = this.authenticationService.resetToken();

          this.log.debug('loadMenu isConnected' + this.isConnected());

        },
        () => this.log.debug('loadMenu success'));


    } else {

      this.log.debug('guest ');

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
         
            this.log.debug('isConnected' + this.isConnected());
            this.log.debug('isAuthenticated' + this.authenticationService.isAuthenticated());
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
