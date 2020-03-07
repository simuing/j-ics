import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsListComponent } from './company-management/assets-list/assets-list.component';
import { AssetsWriteComponent } from './company-management/assets-write/assets-write.component';


const routes: Routes = [
  { path: 'company-management/assets-list', component: AssetsListComponent },
  { path: 'company-management/assets-write', component: AssetsWriteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
