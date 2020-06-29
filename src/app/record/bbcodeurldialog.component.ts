import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({

  selector: 'app-bbcodeurldialog',
  templateUrl: 'bbcodeurldialog.component.html',

})
export class BBCodeURLDialogComponent  {
  constructor(
    public dialogRef: MatDialogRef<BBCodeURLDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
