import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './common/services/common.service';

import { CommonComponentsModule } from './common/components/common-components.module';
import { CompanyManagementModule } from './company-management/company-management.module'

import { AngularMaterialAllModule } from './common/modules/angular-material-all.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    /* Custom Module */
    CommonComponentsModule, //공통 모듈
    CompanyManagementModule,

    /* Angular Material */
    AngularMaterialAllModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
