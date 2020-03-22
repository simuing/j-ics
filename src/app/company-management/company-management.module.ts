import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { AngularMaterialAllModule } from '../common/modules/angular-material-all.module';

import { AssetsManagementModule } from './assets-management/assets-management.module'

@NgModule({
  imports: [
    CommonModule,
    // AngularMaterialAllModule
    AssetsManagementModule
  ],
  exports: [
    AssetsManagementModule
  ],
  declarations: [
  ]
})
export class CompanyManagementModule { }
