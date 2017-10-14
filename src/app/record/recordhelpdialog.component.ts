import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-record-help-dialog',
  templateUrl: 'recordhelpdialog.component.html',
  styleUrls: ['recordhelpdialog.component.css']
})
export class RecordHelpDialogComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
