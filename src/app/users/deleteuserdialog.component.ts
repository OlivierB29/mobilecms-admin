import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-confirmdeleteuserdialog',
  templateUrl: 'deleteuserdialog.component.html',

})
export class DeleteUserDialogComponent  {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }
}
