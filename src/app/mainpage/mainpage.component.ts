
import { Component, OnInit } from '@angular/core';
import { User, Label, RecordType } from '../_models/index';
import { AlertService, AuthenticationService, ContentService, LocaleService } from 'app/_services/index';

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



    lang: string;

    loading = false;

    model: any = {};

    constructor(protected contentService: ContentService,
       private authenticationService: AuthenticationService,
       private locale: LocaleService, private alertService: AlertService) {

    }

      ngOnInit() {

        this.lang = this.locale.getLang();

        this.initUser();
        if (this.isConnected()) {
          this.initUi();
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
              console.log('currentUser ...' + this.currentUser.role + ' ' + this.hasAdminRole);
              this.hasRole = this.currentUser.role === 'editor' || this.currentUser.role === 'admin';
            }

          }

          private initMenu() {
            //
            // About roles : this just a frontend features. Roles must be tested in the API.
            //
            console.log('initMenu ...' + this.currentUser.role + ' ' + this.hasAdminRole);
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
                      this.initUser();
                      if (this.isConnected()) {
                        this.alertService.success('authenticated');
                        this.initUi();
                      } else {
                        this.alertService.error('empty user');
                      }
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
