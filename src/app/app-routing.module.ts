import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsListComponent } from './company-management/assets-management/assets-list/assets-list.component';
import { AssetsWriteComponent } from './company-management/assets-management/assets-write/assets-write.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'company-management/assets-list', component: AssetsListComponent },
  { path: 'company-management/assets-write', component: AssetsWriteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
