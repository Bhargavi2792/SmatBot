import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveUsersPage } from './active-users.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveUsersPageRoutingModule {}
