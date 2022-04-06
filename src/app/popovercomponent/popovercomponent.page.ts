import { Component, OnInit,HostListener } from '@angular/core';
import { PopoverController,ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatUsersResponse } from '../Model/chatusersresponse';
import { UtilsService } from '../services/utils.service';
import { BotList } from 'src/app/Model/botList';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-popovercomponent',
  templateUrl: './popovercomponent.page.html',
  styleUrls: ['./popovercomponent.page.scss'],
})
export class PopovercomponentPage implements OnInit {
  activeUsersList:Array<ChatUsersResponse>;
  selectedBot:BotList;
  feedbackRating = '';
  feedbackMsg = '';
  selectedChat:ChatUsersResponse;
  constructor(private popover:PopoverController,
  private route:Router,
  public utils:UtilsService,
  private apiservice:ApiService,
  private modalController: ModalController){ }
  
  ngOnInit(){
    console.log ("Active chat tab");
    this.selectedChat = this.utils.getchatUserResponse();
    this.feedbackRating = this.utils.getfeedbackRating();
    if(this.feedbackRating != ''){
      this.feedbackRating = this.feedbackRating + ' Star';
    }
    this.feedbackMsg = this.utils.getfeedbackMsg();
    console.log("selected bot",this.selectedChat);
    console.log("Request feedback rating",this.feedbackRating);
    console.log("Request feedback message",this.feedbackMsg);
  }

  ClosePopover(){
    this.popover.dismiss();
  }

  userInfoClicked(){
    this.route.navigate(['popoverinfo']);
  }

  getActiveChatUsers() {
    this.utils.showLoader("Please wait while we fetch your popover data...");
    let body = new URLSearchParams();
    body.set('chatbot_id',this.selectedBot.id);
    body.set('is_closed', '0');
    this.apiservice.getLivechat(body.toString()).then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in PopoverComponent page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      }else {
        this.activeUsersList = new Array<ChatUsersResponse>();
        this.activeUsersList = response.data.data;
        console.log("Active Users",this.activeUsersList);
      }
    });
  }
  
  ///***  Active bot button clicked action ***///
  activebotClicked(new_user) {
    this.utils.setchatUserResponse(new_user);
    this.route.navigate(['chatmessenger']);
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}

