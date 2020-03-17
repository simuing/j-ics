import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AssetsListComponent } from './assets-management/assets-list/assets-list.component';
// import { AssetsWriteComponent } from './assets-management/assets-write/assets-write.component';
//import { AngularMaterialAllModule } from '../common/modules/angular-material-all.module';

import { AssetsManagementModule } from './assets-management/assets-management.module'

@NgModule({
  imports: [
    CommonModule,
    // AngularMaterialAllModule
    AssetsManagementModule
  ],
  exports: [
    // AssetsListComponent,
    // AssetsWriteComponent
    AssetsManagementModule
  ],
  declarations: [
    // AssetsListComponent,
    // AssetsWriteComponent
  ]
})
export class CompanyManagementModule { }
