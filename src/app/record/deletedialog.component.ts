import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-confirmdialog',
  templateUrl: 'deletedialog.component.html',

})
export class DeleteDialogComponent  {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }
}
