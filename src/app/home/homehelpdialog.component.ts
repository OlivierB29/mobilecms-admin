import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  
  selector: 'app-home-help-dialog',
  templateUrl: 'homehelpdialog.component.html',
  styleUrls: ['homehelpdialog.component.css']
})
export class HomeHelpDialogComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
