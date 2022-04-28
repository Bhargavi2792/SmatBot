import { Component, OnInit,HostListener } from '@angular/core';
import { PopoverController,NavParams,ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ChatUsersResponse } from '../Model/chatusersresponse';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { AssignagentpopupPage } from '../assignagentpopup/assignagentpopup.page';
import { AssignAgent } from '../Model/assignagent';


@Component({
  selector: 'app-activepopup',
  templateUrl: './activepopup.page.html',
  styleUrls: ['./activepopup.page.scss'],
})  
export class ActivepopupPage implements OnInit {
  closechat:Array<ChatUsersResponse>;
  bot:ChatUsersResponse;
  showUserInfoBtn:boolean;
  assignAgent: Array<AssignAgent>;
  constructor(private activepopup:PopoverController,
  private socket: Socket,
  private route : Router,
  public navParams:NavParams,
  public utilservice :UtilsService,
  private apiservice : ApiService,
  private modalController: ModalController) { }
  

  ngOnInit(){
    console.log(this.navParams);
    if((this.navParams.data.isFrmChatMessenger) == "true"){
      this.showUserInfoBtn = true;
    }
    else {
      this.bot=this.navParams.data.paramId;
      console.log(this.bot);
      this.showUserInfoBtn = false;
    }
  }
  

  async CloseActivepopup(new_user:any,type:string) {
    await this.activepopup.dismiss(new_user,type);
  }

  userInfoClicked(){
    this.route.navigate(['activepopupinfo']);
  }

  CloseChat() {
    let currentTime = new Date();
    let new_user = {
      session_id: this.bot.session_id,
      device_print:this.bot.device_print,
      agent_name:this.bot.agent_name,
      time: currentTime,
      channel:this.bot.channel
    }
    this.socket.emit('closesessionfromadmin',new_user);
    console.log(" closesessionfromadmin",new_user);
    this.CloseActivepopup(new_user,'CloseChat');
  }
  
  MarkasResolved() {
    let currentTime = new Date();
    let global_scope = this;
    let new_user = {
      session_id: this.bot.session_id,
      device_print:this.bot.device_print,
      agent_name:this.bot.agent_name,
      time: currentTime,
      channel: this.bot.channel
    }
    this.socket.emit('markresolved', new_user); 
    console.log(" markresolved",new_user);
    this.CloseActivepopup(new_user,'MarkAsResolved');
  }

  RequestFeedback(){
    let currentTime = new Date();
    let global_scope = this;
    let new_user = {
      session_id: this.bot.session_id,
      device_print:this.bot.device_print,
      agent_name:this.bot.agent_name,
      time: currentTime,
      channel: this.bot.channel
    }
    this.socket.emit('requestfeedback',new_user)
    console.log("requestfeedback",new_user);
    this.socket.on('submitfeedback',function(a) {
      console.log("submitfeedback",a);
      console.log("submitfeedback rating",a.rating);
      global_scope.utilservice.setfeedbackRating(a.rating);
    });
    this.socket.on('submitfeedbackmessage',function(b){
      console.log("submitfeedbackmessage",b);
      console.log("submitfeedbackmessage",b.message);
      global_scope.utilservice.setfeedbackMsg(b.message);
    });
    this.CloseActivepopup(new_user,'RequestFeedback');
  }


  async AssignAgent(index){
    const popover = await this.activepopup.create({component:AssignagentpopupPage,
      componentProps:{"paramId":this.assignAgent[index]},backdropDismiss:true});
      return await popover.present();
  }

  
  ShowUserDetails(){
    this.route.navigate(['popovercomponent']);
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
} 
