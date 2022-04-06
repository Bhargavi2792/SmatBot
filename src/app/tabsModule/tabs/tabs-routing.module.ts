import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'active-users',
        children: [
          {
            path: '',
            loadChildren: () => import('../active-users/active-users.module').then( m => m.ActiveUsersPageModule)
          }
        ]
      },
      {
        path: 'closed-users',
        children: [
          {
            path: '',
            loadChildren: () => import('../closed-users/closed-users.module').then( m => m.ClosedUsersPageModule)
          }
        ]
      },
     
      {
        path: '',
        redirectTo: '/tabs/active-users',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/active-users',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
