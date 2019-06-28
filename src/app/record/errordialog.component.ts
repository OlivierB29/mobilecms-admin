import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  
  selector: 'app-errordialog',
  templateUrl: 'errordialog.component.html',

})
export class ErrorDialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
