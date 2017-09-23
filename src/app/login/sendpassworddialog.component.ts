import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  templateUrl: 'sendpassworddialog.component.html',

})
export class SendPasswordDialogComponent  {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }
}