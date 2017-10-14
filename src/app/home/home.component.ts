import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HomeHelpDialogComponent } from './homehelpdialog.component';


@Component({
    moduleId: module.id,
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {


    constructor(
       public dialog: MatDialog) {
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
