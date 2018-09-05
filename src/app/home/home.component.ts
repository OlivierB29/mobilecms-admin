import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HomeHelpDialogComponent } from './homehelpdialog.component';
import { Log } from 'app/shared';


@Component({
    
    selector: 'app-homeadmin',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {

  
    constructor(private log: Log,
       public dialog: MatDialog) {
    }

    /**
    * help
    */
    openHelpDialog() {
      const dialogRef = this.dialog.open(HomeHelpDialogComponent, {
         data: '',
      });
      dialogRef.afterClosed().subscribe(result => { this.log.debug('Dialog result'); });
    }

}
