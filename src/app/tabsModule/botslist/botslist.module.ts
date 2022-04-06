import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BotslistPageRoutingModule } from './botslist-routing.module';
import { BotslistPage } from './botslist.page';
import {ComponentsModule} from '../../components/components.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BotslistPageRoutingModule,
    ComponentsModule,
    Ng2SearchPipeModule
  ],
  declarations: [BotslistPage]
})
export class BotslistPageModule {}
