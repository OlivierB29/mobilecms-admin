import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService, ContentService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];


    items: any[] = [];


    constructor(private userService: UserService, private contentService:ContentService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();

        this.contentService.getTables()
            .subscribe((data: Event[]) => this.items = data,
            error => console.log('getItems ' + error),
            () => console.log('getItems complete :' + this.items.length));

    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}
