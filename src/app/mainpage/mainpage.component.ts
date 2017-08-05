
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User, Label, RecordType } from '../_models/index';
import { AlertService, AuthenticationService, ContentService, LocaleService } from '../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-my-mainpage',
  templateUrl: 'mainpage.component.html',
  styleUrls: ['mainpage.component.css']
})
export class MainPageComponent  implements OnInit, AfterViewInit {


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

    menuItems: RecordType[] = null;

    lang: string;

    loading = false;

    model: any = {};

    constructor(protected contentService: ContentService,
       private authenticationService: AuthenticationService,
       private locale: LocaleService, private alertService: AlertService) {

    }

      ngOnInit() {

        this.lang = this.locale.getLang();



        if (this.isConnected()) {
          this.initUi();
        }

      }

      ngAfterViewInit() {
        // TODO doesn't work
      /*  if (!this.isConnected()) {
          this.openLoginDialog();
        }
        */
      }



      private initUi() {
        this.initMenuLayout();

        this.initUser();

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

            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!! ' +  this.menuMode + ' ' + this.menuOpened);
          }

          private initUser(): void {

            const currentUserLocalStorage = localStorage.getItem('currentUser');

            if (currentUserLocalStorage) {
              this.currentUser = JSON.parse(currentUserLocalStorage);
              this.currentUser.token = '';
              console.log('currentUser ...');

              this.hasAdminRole = this.currentUser.role === 'admin';
              this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
            }

          }

          private initMenu() {
            //
            // About roles : this just a frontend features. Roles must be tested in the API.
            //

            if (this.isConnected() && this.hasRole) {
              this.contentService.getTables()
                .subscribe((data: RecordType[]) => this.menuItems = data,
                error => console.log('getItems ' + error),
                () => {
                  console.log('getItems complete :' + this.menuItems.length);

                  // iterate each type
                  if (this.menuItems) {

                    this.menuItems.forEach((record: RecordType) => {
                      // detect label value
                      record.labels.map((label: Label) => {
                        if (label.i18n === this.lang) {
                          record.label = label.label;
                          return label;
                        }
                      });



                    });
                  }
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

      isConnected(): boolean {
        return this.currentUser != null;
      }



      login() {
          this.loading = true;
          this.authenticationService.login(this.model.username, this.model.password)
              .subscribe(
                  data => {
                      console.log('success');
                        this.initUi();
                        this.loading = false;
                  },
                  error => {
                      console.log('error');
                      this.alertService.error(error);
                      this.loading = false;
                  });
      }



      disconnect() {
        this.currentUser = null;
        this.hasRole = false;
        this.hasAdminRole = false;
        this.authenticationService.logout();
      }


}
