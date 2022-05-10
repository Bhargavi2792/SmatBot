import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrimaryheaderComponent} from '../components/primaryheader/primaryheader.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [PrimaryheaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PrimaryheaderComponent
  ]
})
export class ComponentsModule { }
