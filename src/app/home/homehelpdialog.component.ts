import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-home-help-dialog',
  templateUrl: 'homehelpdialog.component.html',
  styleUrls: ['homehelpdialog.component.css']
})
export class HomeHelpDialogComponent {
  constructor( @Inject(MD_DIALOG_DATA) public data: any) {
  }
}
