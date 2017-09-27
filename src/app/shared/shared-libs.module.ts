import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MyMaterialModule } from 'app/mymaterial.module';


@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      MyMaterialModule
    ],
    exports: [
        FormsModule,
        CommonModule,
        MyMaterialModule
    ]
})
export class AdminCmsSharedLibsModule {}
