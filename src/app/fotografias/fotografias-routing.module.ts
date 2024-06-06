import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FotografiasPage } from './fotografias.page';

const routes: Routes = [
  {
    path: '',
    component: FotografiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FotografiasPageRoutingModule {}
