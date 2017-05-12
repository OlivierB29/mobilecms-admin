import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ContentService } from '../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'recordlist.component.html',
    styleUrls: ['recordlist.component.css']
})

export class RecordListComponent implements OnInit {

    /**
     * record data
     */
    items: any[] = [];

    /**
     * current type : news, calendar, ...
     */
    type = '';

    /**
     * response on rebuild
     */
    response: any = null;



    constructor(private route: ActivatedRoute, private contentService: ContentService ) {}

    ngOnInit() {
        console.log('RecordListComponent ');

            this.route.params.forEach((params: Params) => {


                this.type = params['type'];

                if (this.type) {

                  this.contentService.getRecords(this.type)
                      .subscribe((data: any[]) => this.items = data,
                      error => console.log('getItems ' + error),
                      () => {
                        console.log('getItems complete ' + this.type + ' ' + this.items.length);
                    });

                }

            });




    }


    rebuildIndex() {
      this.contentService.rebuildIndex(this.type)
        .subscribe((data: any) => this.response = JSON.stringify(data),
        error => console.error('post' + error),
        () => { console.log('post complete'); });

    }

}
