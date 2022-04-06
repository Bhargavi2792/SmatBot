import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatmessengerPageRoutingModule } from './chatmessenger-routing.module';
import { ChatmessengerPage } from './chatmessenger.page';
import {ComponentsModule} from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChatmessengerPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChatmessengerPage]
})
export class ChatmessengerPageModule {}
