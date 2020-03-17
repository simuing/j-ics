import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetsWriteComponent } from './assets-write/assets-write.component';
import { AngularMaterialAllModule } from '../../common/modules/angular-material-all.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialAllModule
  ],
  exports: [
    AssetsListComponent,
    AssetsWriteComponent
  ],
  declarations: [
    AssetsListComponent,
    AssetsWriteComponent
  ]
})
export class AssetsManagementModule { }
