import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared';



@Component({
    
    selector: 'app-alert-message',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.css']
})

export class AlertComponent implements OnInit {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}
