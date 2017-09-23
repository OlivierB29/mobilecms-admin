import { NgModule } from '@angular/core';

import { MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
   MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
 MdTooltipModule, MdToolbarModule, MatExpansionModule } from '@angular/material';


@NgModule({
  imports: [ MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
     MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
   MdTooltipModule, MdToolbarModule, MatExpansionModule ],
  exports: [ MdSidenavModule, MdButtonModule, MdDialogModule, MdListModule,
     MdInputModule, MdSelectModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
   MdTooltipModule, MdToolbarModule, MatExpansionModule ],
})
export class MyMaterialModule { }
