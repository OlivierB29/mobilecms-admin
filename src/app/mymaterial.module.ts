import { NgModule } from '@angular/core';

import { NoConflictStyleCompatibilityMode , MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
   MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
 MatTooltipModule, MatToolbarModule, MatExpansionModule } from '@angular/material';


@NgModule({
  imports: [ NoConflictStyleCompatibilityMode, MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
     MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
   MatTooltipModule, MatToolbarModule, MatExpansionModule ],
  exports: [ MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
     MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
   MatTooltipModule, MatToolbarModule, MatExpansionModule ],
})
export class MyMaterialModule { }
