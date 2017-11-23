import { NgModule } from '@angular/core';

import {
  MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
  MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
  MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule
} from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// NoConflictStyleCompatibilityMode https://github.com/angular/material2/blob/master/CHANGELOG.md#deprecation-of-md-prefix
@NgModule({
  imports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule],
  exports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule],
})
export class MyMaterialModule { }
