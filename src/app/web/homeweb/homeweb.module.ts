import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomewebComponent } from './homeweb.component';
import { HomewebRoutingModule } from './homeweb-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [HomewebComponent],
  imports: [
    CommonModule,
    IonicModule,
    HomewebRoutingModule
  ]
})
export class HomewebModule { }
