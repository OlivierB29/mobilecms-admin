import { NgModule } from '@angular/core';

import { MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
   MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
 MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule } from '@angular/material';

// NoConflictStyleCompatibilityMode https://github.com/angular/material2/blob/master/CHANGELOG.md#deprecation-of-md-prefix
@NgModule({
  imports: [  MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
     MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
   MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule ],
  exports: [ MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
     MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule,
   MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule ],
})
export class MyMaterialModule { }
