import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { OnInit, AfterViewInit,  ChangeDetectorRef } from '@angular/core';
import { User, Label, RecordType } from 'src/app/_models/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';



import { MenuItem } from './menuitem';
import { SendPasswordDialogComponent } from 'src/app/login';
import { LoginService, LocaleService, AlertService, WindowService, Log, ContentService } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/app/shared';



@Component({
  
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
    protected securityService: SecurityService,
    private authenticationService: LoginService,
    private log: Log,
    private locale: LocaleService, private alertService: AlertService,
    private windowService: WindowService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute) {}



  ngOnInit() {

    this.log.debug('ngOnInit ...');
    this.lang = this.locale.getLang();

    this.home = new MenuItem();
    this.home.url = environment.website;
    this.home.label = 'site.label';
    this.loadMenu();
  }

  ngAfterViewInit() {
    
  }


 

  private loadMenu() {

    this.log.debug('loadMenu ... ');

    this.menuItems = [];

    this.adminMenuItems = [];
    //
    // About roles : this just a frontend feature. Roles must be tested in the API.
    //



      let recordTypes: RecordType[] = null;

      this.contentService.getTables().subscribe(users => {
        recordTypes = users;

        // iterate each type
        if (recordTypes) {
          this.log.debug('loadMenu recordTypes ...');
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


  



  }



  public isAuthenticated(): Observable<boolean> | boolean {
    return this.securityService.isAuthenticated();
  }

  public isConnected(): Observable<boolean> | boolean {
    return this.securityService.isConnected();
  }








  disconnect() {

    this.authenticationService.logout();
    this.router.navigate(['/login']);
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
