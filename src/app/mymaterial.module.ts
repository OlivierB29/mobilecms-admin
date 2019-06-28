import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// NoConflictStyleCompatibilityMode https://github.com/angular/material2/blob/master/CHANGELOG.md#deprecation-of-md-prefix
@NgModule({
  imports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule, MatFormFieldModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCheckboxModule
],
  exports: [MatSidenavModule, MatButtonModule, MatDialogModule, MatListModule,
    MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatToolbarModule, MatExpansionModule, MatMenuModule,
    MatButtonToggleModule, MatFormFieldModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCheckboxModule
  ],
})
export class MyMaterialModule { }
