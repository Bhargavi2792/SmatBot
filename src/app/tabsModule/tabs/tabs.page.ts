import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { ActiveUsersPage } from '../active-users/active-users.page';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import { BotList } from 'src/app/Model/botList';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {
  selectedBot:BotList;
  title:string;
  constructor(private socket: Socket,
  public utils:UtilsService,
  private toastCtrl: ToastController,
  private route : Router,
  private apiservice : ApiService) { }
  
  ngOnInit() {
    this.selectedBot = this.utils.getselectedbotList();
    console.log("Selected bot in tabs page",this.selectedBot);
    this.title = 'Bots > ' + this.selectedBot.name;
  }
}