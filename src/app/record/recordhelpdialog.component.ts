import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-record-help-dialog',
  templateUrl: 'recordhelpdialog.component.html',
  styleUrls: ['recordhelpdialog.component.css']
})
export class RecordHelpDialogComponent {
  constructor( @Inject(MD_DIALOG_DATA) public data: any) {
  }
}
