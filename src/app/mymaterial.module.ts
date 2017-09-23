import { NgModule } from '@angular/core';

import { MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
   MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
 MdTooltipModule, MdToolbarModule } from '@angular/material';


@NgModule({
  imports: [ MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
     MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
   MdTooltipModule, MdToolbarModule ],
  exports: [ MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
     MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
   MdTooltipModule, MdToolbarModule ],
})
export class MyMaterialModule { }
