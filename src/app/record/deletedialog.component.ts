import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  
  selector: 'app-confirmdialog',
  templateUrl: 'deletedialog.component.html',

})
export class DeleteDialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
