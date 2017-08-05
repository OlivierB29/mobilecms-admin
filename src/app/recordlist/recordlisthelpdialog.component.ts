import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-recordlist-help-dialog',
  templateUrl: 'recordlisthelpdialog.component.html',
  styleUrls: ['recordlisthelpdialog.component.css']
})
export class RecordListHelpDialogComponent {
  constructor( @Inject(MD_DIALOG_DATA) public data: any) {
  }
}
