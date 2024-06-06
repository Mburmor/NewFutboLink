// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'create-match',
    loadChildren: () => import('./pages/create-match/create-match.module').then(m => m.CreateMatchPageModule)
  },
  {
    path: 'match-list',
    loadChildren: () => import('./pages/match-list/match-list.module').then(m => m.MatchListPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'fotografias',
    loadChildren: () => import('./fotografias/fotografias.module').then(m => m.FotografiasPageModule)
  },
  {
    path: 'tactibot',
    loadChildren: () => import('./pages/tactibot/tactibot.module').then(m => m.TactibotModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'homeweb',
    loadChildren: () => import('./web/homeweb/homeweb.module').then(m => m.HomewebModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./web/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login-logs',
    loadChildren: () => import('./web/admin/login-logs/login-logs.module').then(m => m.LoginLogsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
