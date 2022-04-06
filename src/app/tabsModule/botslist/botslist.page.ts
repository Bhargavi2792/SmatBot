import { Component, OnInit, ViewChild,OnDestroy,AfterViewInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import { Router } from '@angular/router';
import { BotList} from '../../Model/botList';
import { UtilsService} from '../../services/utils.service';
import { IonSearchbar} from '@ionic/angular';
import {SocketService}  from '../../services/socket.service';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-botslist',
  templateUrl: './botslist.page.html',
  styleUrls: ['./botslist.page.scss'],
})
export class BotslistPage implements OnInit {
  filterItem: string;
  title:string;
  public chatbots: Array<BotList> = [];
  constructor(private route : Router,
  private apiservice : ApiService,
  public utils:UtilsService,
  private socketservice:SocketService,
  private socket: Socket,) {
    this.chatbots = [];
  }
  
  ngOnInit() {
    this.getChatbots(null);
    this.title = 'Bot List';
  }
  

  ionViewWillLeave(){
    this.filterItem = '';
  }
  

  getChatbots(event) {
    this.utils.showLoader("Please wait while we fetch your Botlist...");
    this.apiservice.getChatbots().then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Botlist page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
        if (event)
          event.target.complete();
      } else {
        console.log("Success response in Botlist page",(response as any).data);
        this.chatbots = response.data.chatbot_details;
        console.log(this.chatbots);
        if (event){
          event.target.complete();
        }
      }
    })
  }
  

  ///*** bot button clicked action ***///
  botButtonClicked(item) {
    localStorage.setItem('chatbot_id',item.id);
    this.utils.setselectedbotList(item);
    this.route.navigate(['tabs']);
  }
  
  
  ///*** method to set active or inactive ***///
  setChatStatus(item) {
    if(item.is_disabled == '0'){
      return "Active"
    } else {
      return "Inactive"
    }
  }
}