import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TactibotRoutingModule } from './tactibot-routing.module';
import { TactibotComponent } from './tactibot.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TactibotRoutingModule
  ],
  declarations: [TactibotComponent]
})
export class TactibotModule {}
