import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TactibotComponent } from './tactibot.component';

const routes: Routes = [
  {
    path: '',
    component: TactibotComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TactibotRoutingModule {}
