import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BotslistPage } from './botslist.page';

const routes: Routes = [
  {
    path: '',
    component: BotslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BotslistPageRoutingModule {}
