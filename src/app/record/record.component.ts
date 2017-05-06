import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ContentService } from '../_services/index';
import { Metadata } from 'app/_models';

@Component({
    moduleId: module.id,
    templateUrl: 'record.component.html'
})

export class RecordComponent implements OnInit {

    i18n = {};

    /**
     * current type : news, calendar, ...
     */
    type: string = 'news';

    /**
     * object id
     */
    id = '';

    /**
     * object data
     */
    current: any = null;

    /**
     * object metadata
     */
    properties: Metadata[];

    /**
     * response on save
     */
    response: any = null;


    constructor(private route: ActivatedRoute, private contentService: ContentService) { }


    ngOnInit() {

        this.contentService.getMetadata('calendar/index/metadata.json')
            .subscribe((data: any[]) => { this.properties = data;},
            error => console.log('loadMetadata ' + error),
            () => console.log('loadMetadata OK'));

        this.route.params.forEach((params: Params) => {

            this.type = params['type'];

            this.id = params['id'];

            if (this.id) {
                //read record content
                this.contentService.getRecord(this.type, this.id)
                    .subscribe((data: any) => {this.current = data;},
                    error => console.error('get' + error),
                    () => { console.log('get complete'); });
            } else {
                console.error("editcalendar-form empty id");
            }

        });

    }


    save() {


                this.contentService.post(this.type, this.current)
                    .subscribe((data: any) => this.response = JSON.stringify(data),
                    error => console.error('post' + error),
                    () => { console.log('post complete'); });

    }
}
