import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: 'login',loadChildren: () => import('./loginModule/login/login.module').then( m => m.LoginPageModule)},
  {path: '',redirectTo: 'login',pathMatch: 'full'},
  {path: 'active-users',loadChildren: () => import('./tabsModule/active-users/active-users.module').then( m => m.ActiveUsersPageModule)},
  {path: 'closed-users',loadChildren: () => import('./tabsModule/closed-users/closed-users.module').then( m => m.ClosedUsersPageModule)},
  {path: 'tabs',loadChildren: () => import('./tabsModule/tabs/tabs.module').then( m => m.TabsPageModule)},
  {path: 'botslist',loadChildren: () => import('./tabsModule/botslist/botslist.module').then( m => m.BotslistPageModule)},
  {path: 'menu',loadChildren: () => import('./tabsmodule/menu/menu.module').then( m => m.MenuPageModule)},
  {path: 'chatmessenger',loadChildren: () => import('./tabsModule/chatmessenger/chatmessenger.module').then( m => m.ChatmessengerPageModule)},
  {
    path: 'popovercomponent',
    loadChildren: () => import('./popovercomponent/popovercomponent.module').then( m => m.PopovercomponentPageModule)
  },
  {
    path: 'activepopup',
    loadChildren: () => import('./activepopup/activepopup.module').then( m => m.ActivepopupPageModule)
  },
  {
    path: 'assignagentpopup',
    loadChildren: () => import('./assignagentpopup/assignagentpopup.module').then( m => m.AssignagentpopupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
