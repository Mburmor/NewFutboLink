import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FotografiasPageRoutingModule } from './fotografias-routing.module';

import { FotografiasPage } from './fotografias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FotografiasPageRoutingModule
  ],
  declarations: [FotografiasPage]
})
export class FotografiasPageModule {}
