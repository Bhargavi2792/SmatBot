import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivepopupPageRoutingModule } from './activepopup-routing.module';

import { ActivepopupPage } from './activepopup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivepopupPageRoutingModule
  ],
  declarations: [ActivepopupPage]
})
export class ActivepopupPageModule {}
