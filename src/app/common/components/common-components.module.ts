/**
 * @description 공통 컴포넌트 모듈
 * @component : header / left-menu / footer
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { AngularMaterialAllModule } from '../modules/angular-material-all.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftMenuComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialAllModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftMenuComponent
  ]
})
export class CommonComponentsModule { }
