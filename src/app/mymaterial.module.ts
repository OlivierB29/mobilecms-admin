import { NgModule } from '@angular/core';

import {
  MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
  MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
  MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule, MatFormFieldModule
} from '@angular/material';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// NoConflictStyleCompatibilityMode https://github.com/angular/material2/blob/master/CHANGELOG.md#deprecation-of-md-prefix
@NgModule({
  imports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule, MatFormFieldModule,
    MatTableModule, MatPaginatorModule, MatSortModule],
  exports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule, MatFormFieldModule,
    MatTableModule, MatPaginatorModule, MatSortModule],
})
export class MyMaterialModule { }
