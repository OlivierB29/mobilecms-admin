import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  
  selector: 'app-confirmdeleteuserdialog',
  templateUrl: 'deleteuserdialog.component.html',

})
export class DeleteUserDialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
