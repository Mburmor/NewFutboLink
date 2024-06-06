import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomewebComponent } from './homeweb.component';

const routes: Routes = [
  { path: '', component: HomewebComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomewebRoutingModule { }
