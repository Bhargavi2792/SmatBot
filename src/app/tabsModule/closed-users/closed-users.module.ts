import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClosedUsersPageRoutingModule } from './closed-users-routing.module';
import { ClosedUsersPage } from './closed-users.page';
import {ComponentsModule} from '../../components/components.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClosedUsersPageRoutingModule,
    ComponentsModule,
    Ng2SearchPipeModule
  ],
  declarations: [ClosedUsersPage]
})
export class ClosedUsersPageModule {}
