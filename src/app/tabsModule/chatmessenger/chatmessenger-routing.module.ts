import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatmessengerPage } from './chatmessenger.page';

const routes: Routes = [
  {
    path: '',
    component: ChatmessengerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatmessengerPageRoutingModule {}
