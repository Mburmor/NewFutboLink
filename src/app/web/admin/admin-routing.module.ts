import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule)
  },
  {
    path: 'login-logs',
    loadChildren: () => import('./login-logs/login-logs.module').then(m => m.LoginLogsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
