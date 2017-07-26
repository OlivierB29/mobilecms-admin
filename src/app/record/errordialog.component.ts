import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-errordialog',
  templateUrl: 'errordialog.component.html',

})
export class ErrorDialogComponent  {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }
}
