import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  
  templateUrl: 'sendpassworddialog.component.html',

})
export class SendPasswordDialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
