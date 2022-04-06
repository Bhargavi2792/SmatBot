import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivepopupPage } from './activepopup.page';

const routes: Routes = [
  {
    path: '',
    component: ActivepopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivepopupPageRoutingModule {}
