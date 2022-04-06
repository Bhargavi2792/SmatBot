import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignagentpopupPageRoutingModule } from './assignagentpopup-routing.module';

import { AssignagentpopupPage } from './assignagentpopup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignagentpopupPageRoutingModule
  ],
  declarations: [AssignagentpopupPage]
})
export class AssignagentpopupPageModule {}
