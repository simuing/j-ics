/**
 * @description 공통 컴포넌트 모듈
 * @component : header / left-menu / footer
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* libs */
import { AngularMaterialAllModule } from '../modules/angular-material-all.module';
import { NgxChartsAllModule } from '../modules/ngx-charts-all.module';
/* custom components */
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftMenuComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialAllModule,
    NgxChartsAllModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftMenuComponent
  ]
})
export class CommonComponentsModule { }
