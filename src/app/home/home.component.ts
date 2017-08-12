import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { HomeHelpDialogComponent } from './homehelpdialog.component';


@Component({
    moduleId: module.id,
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {


    constructor(
       public dialog: MdDialog) {
         console.log(' 1 ' + JSON.stringify({a: 'a'}));
         console.log(' 2 ' + JSON.stringify({a: 'b,'}));
         console.log(' 3 ' + JSON.stringify(JSON.parse(JSON.stringify({c: 'b,'.replace(',', '\,')}))));
         console.log(' 4 ' + JSON.stringify({d: 'b,'.replace(',', '\,')}));
    }

    /**
    * help
    */
    openHelpDialog() {
      const dialogRef = this.dialog.open(HomeHelpDialogComponent, {
         data: '',
      });
      dialogRef.afterClosed().subscribe(result => { console.log('Dialog result'); });
    }

}
