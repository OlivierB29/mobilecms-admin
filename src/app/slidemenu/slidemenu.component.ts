import { Component, OnInit } from '@angular/core';

import { User, Label, RecordType } from '../_models/index';
import { ContentService, LocaleService } from '../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-my-slidemenu',
  templateUrl: 'slidemenu.component.html',
  styleUrls: ['slidemenu.component.css']
})
export class SlidemenuComponent implements OnInit {



  lang: string;


  menuItems: RecordType[] = [];




  mobileLayout: boolean;

  currentUser: User;

  hasRole = false;

  hasAdminRole = false;

  constructor(private contentService: ContentService, private locale: LocaleService) { }


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

  ngOnInit() {


    const lang = this.locale.getLang();

    this.initUser();

    //
    // About roles : this just a frontend features. Roles must be tested in the API.
    //




    if (this.hasRole) {


      this.contentService.getTables()
        .subscribe((data: RecordType[]) => this.menuItems = data,
        error => console.log('getItems ' + error),
        () => {
          console.log('getItems complete :' + this.menuItems.length);

          // iterate each type
          this.menuItems.forEach((record: RecordType) => {
            // detect label value
            record.labels.map((label: Label) => {
              if (label.i18n === lang) {
                record.label = label.label;
                return label;
              }
            });



          });

        });


    } else {
      console.log('guest ');

    }

  }

}