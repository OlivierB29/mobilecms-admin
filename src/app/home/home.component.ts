﻿import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { ContentService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;


    items: any[] = [];


    constructor( private contentService:ContentService ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        this.contentService.getTables()
            .subscribe((data: any[]) => this.items = data,
            error => console.log('getItems ' + error),
            () => console.log('getItems complete :' + this.items.length));

    }
}
