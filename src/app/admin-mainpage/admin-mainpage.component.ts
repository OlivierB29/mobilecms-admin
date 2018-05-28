import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  selector: 'admin-mainpage',
  templateUrl: 'admin-mainpage.component.html',
  styleUrls: ['admin-mainpage.component.css']
})
export class AdminMainpageComponent  implements OnInit, AfterViewInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);




  menuItems: any[] = null;

  adminMenuItems: any[] = null;

  lang: string;

  loading = false;

  success = false;

  home: MenuItem;


  constructor(private breakpointObserver: BreakpointObserver,
    protected contentService: ContentService,
    private authenticationService: LoginService,
    private log: Log,
    private locale: LocaleService, private alertService: AlertService,
    private windowService: WindowService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute) {}



  ngOnInit() {

    this.log.debug('ngOnInit ...');
    this.lang = this.locale.getLang();

    this.initCurrentUser();
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

  }






  private initCurrentUser() {

    const currentUser = this.getCurrentUser();
    if (currentUser) {

      this.log.debug('local storage');


      currentUser.token = '';


      this.log.debug('currentUser ...' + currentUser.role);

      this.log.debug('isConnected' + this.isConnected());
      this.log.debug('isAuthenticated' + this.authenticationService.isAuthenticated());

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

    this.log.debug('loadMenu ... ');

    this.menuItems = [];

    this.adminMenuItems = [];
    //
    // About roles : this just a frontend feature. Roles must be tested in the API.
    //

    this.log.debug('loadMenu ...');

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

        if (this.isAdminRole()) {
          const userlist = new MenuItem();
          userlist.routerLink = ['/userlist'];
          userlist.title = 'Users';
          this.adminMenuItems.push(userlist);
        }


        this.log.debug('loadMenu complete :' + this.menuItems.length);

      },
        error => {
          console.error('loadMenu menu failure');
          this.authenticationService.resetToken();

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
    return this.authenticationService.isAuthenticated();
  }








  disconnect() {

    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }




  /**
   * About roles : this just a frontend feature. Role must be tested in the API.
   */
  isAdminRole(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.role === 'admin';
  }

  hasRole(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && (currentUser.role === 'editor' || currentUser.role === 'admin');
  }
}
