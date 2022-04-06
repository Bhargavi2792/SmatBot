import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosedUsersPage } from './closed-users.page';

const routes: Routes = [
  {
    path: '',
    component: ClosedUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosedUsersPageRoutingModule {}
