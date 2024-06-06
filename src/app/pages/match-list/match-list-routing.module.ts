import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchListPage } from './match-list.page';

const routes: Routes = [
  {
    path: '',
    component: MatchListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchListPageRoutingModule {}
