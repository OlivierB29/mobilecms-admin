import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/shared';



@Component({
    moduleId: module.id,
    selector: 'app-alert-message',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}
