import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './common/services/common.service';

/* libs */
import { AngularMaterialAllModule } from './common/modules/angular-material-all.module';
import { NgxChartsAllModule } from './common/modules/ngx-charts-all.module';

import { CommonComponentsModule } from './common/components/common-components.module';
import { CompanyManagementModule } from './company-management/company-management.module'


import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    /* Custom Module */
    CommonComponentsModule, //공통 모듈
    CompanyManagementModule,

    /* libs */
    AngularMaterialAllModule,
    NgxChartsAllModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
