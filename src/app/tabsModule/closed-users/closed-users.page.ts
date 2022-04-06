import { Component, OnInit } from '@angular/core';
import { UtilsService} from '../../services/utils.service';
import { BotList } from 'src/app/Model/botList';
import {ChatUsersResponse} from '../../Model/chatusersresponse';
import {ApiService} from '../../services/api.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';


@Component({
  selector: 'app-closed-users',
  templateUrl: './closed-users.page.html',
  styleUrls: ['./closed-users.page.scss'],
})
export class ClosedUsersPage implements OnInit {
  filterItem: string; 
  selectedBot: BotList;
  indexValue='0';
  disableLoadMoreBtn= false;
  closedUsersList= [];
  isFrmClosedChat = true; 
  private showcards: any=3;
  private list: any=[];
  constructor(public utils:UtilsService,
  public apiservice : ApiService,
  private route : Router,
  private socket: Socket) {

  }
  
  ngOnInit() {
    console.log ("Closed chat tab");
    console.log("selected bot",this.utils.getselectedbotList());
    this.selectedBot = this.utils.getselectedbotList();
    console.log("selected bot",this.selectedBot);
    console.log("selected bot id",this.selectedBot.id);
    this.closedUsersList = [];
    this.getClosedChatUsers(this.indexValue);
  }

  addNewUser(new_user) {
    console.log("before inserting",this.closedUsersList);
    this.closedUsersList.push(new_user);
    console.log("after inserting",this.closedUsersList);
  }

  ///*** Method to get active chat users ***///
  getClosedChatUsers(index:string){
    this.utils.showLoader("Please wait while we fetch your closed chat users list...");
    let body = new URLSearchParams();
    body.set('chatbot_id', this.selectedBot.id);
    body.set('index',index);
    this.apiservice.getLivechat(body.toString()).then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
       console.log("Failure response in closed-user page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      } else {
        if((response.data.data).length > 0){
          for(let obj of response.data.data){
            this.closedUsersList.push(obj);
          }
          console.log("Closed Users",this.closedUsersList);
         console.log("Array length",this.closedUsersList.length);
        this.indexValue = String(this.closedUsersList.length);
        console.log(this.indexValue);
        
        }
        else{
          this.disableLoadMoreBtn = true;
        }
      }
      let currentTime = new Date().getTime();
      let global_scope = this;
      this.socket.on('closesession', function(n) {
        console.log(n);
        let new_user2 = {
          agent_id: n.agent_id,
          bot_id: n.bot_id,
          channel: n.channel,
          device_print: n.device_print,
          session_id: n.session_id,
          time: currentTime
        }
        global_scope.addNewUser(new_user2);
      });
    });
  }

  loadData(event){
    setTimeout(() =>{
      console.log("Done");
      this.getClosedChatUsers(this.indexValue);
      event.target.complete();
    }, 500);
  }


  loadMoreData(){
    this.getClosedChatUsers(this.indexValue);
  }

  closedbotClicked(user) {
    let currentTime = new Date();
    console.log("Date",currentTime);
    let time= currentTime.getTime();
    console.log("Time",time);
    var k = currentTime.getTimezoneOffset();
    k = k*60*1000;
    console.log("K",k);
    let curTime = time - k;
    let new_time = new Date(curTime).toLocaleString();
    console.log("Current time",new_time);
    this.utils.showLoader("Please wait while we fetch your chat messages...");
    console.log("Session ID:",user.session_id);
    console.log("ChatBot ID:",localStorage.getItem('chatbot_id'));
    console.log("Channel:",user.channel);
    this.apiservice.getChatData(user.session_id,localStorage.getItem('chatbot_id'),user.channel).then((response) => {
      console.log(response);  
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in closed users page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      }else {
        console.log("chat user response",(response as any).data);
        for(let i = ((response as any).data).answers.length; i > 0; i--){
          if(((response as any).data).answers[i-1].question_text != ''){
            let new_user_obj = {
              agent_name : 'test - admin',
              created_at:new Date(new Date(((response as any).data).answers[i-1].created_at).getTime() - currentTime.getTimezoneOffset()*60000),
              text:((response as any).data).answers[i-1].question_text,
              type:'user'
            }
            console.log("New Object Question",new_user_obj);
            user.messages.splice(0, 0, new_user_obj)
          }
          if(((response as any).data).answers[i-1].answer_text != ''){
            let new_user_obj = {
              agent_name : 'test - admin',
              created_at:new Date(new Date(((response as any).data).answers[i-1].created_at).getTime() - currentTime.getTimezoneOffset()*60000),
              text:((response as any).data).answers[i-1].answer_text,
              type:'customer'
            }
            console.log("New Object Answer",new_user_obj);
            user.messages.splice(1, 0, new_user_obj);
          }
        }
        console.log("User after",user);
        this.utils.setchatUserResponse(user);
        this.route.navigate(['chatmessenger',{isfrmclosedchat:true}]);
      }
    });
  }
}
