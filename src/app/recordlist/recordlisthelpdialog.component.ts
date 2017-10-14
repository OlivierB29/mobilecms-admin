import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-recordlist-help-dialog',
  templateUrl: 'recordlisthelpdialog.component.html',
  styleUrls: ['recordlisthelpdialog.component.css']
})
export class RecordListHelpDialogComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
