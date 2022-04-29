import { Component, OnInit,HostListener,ViewChild } from '@angular/core';
import { BotList } from 'src/app/Model/botList';
import { ApiService } from '../../services/api.service';
import { UtilsService } from '../../services/utils.service';
import { ChatUsersResponse } from '../../Model/chatusersresponse';
import { Router,ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ActivepopupPage } from '../../activepopup/activepopup.page';
import { IonContent, IonInfiniteScrollContent, PopoverController,ModalController,Platform,NavController} from '@ionic/angular';
import { ChatmessengerPage} from '../chatmessenger/chatmessenger.page';
import { ProfileSendRes } from '../../Model/profilesendres';



declare var window;
@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.page.html',
  styleUrls: ['./active-users.page.scss'],
})

export class ActiveUsersPage implements OnInit {
  @ViewChild(IonContent) contentArea: IonContent;
  selectedBot:BotList;
  activeUsersList:Array<ChatUsersResponse>;
  filterItem: string; 
  showMsg = true;
  constructor(private apiservice : ApiService,
  private platform:Platform,
  public utils:UtilsService,
  private route : Router,
  private activatedRoute : ActivatedRoute,
  private socket: Socket,
  private activepopup:PopoverController,
  private modalController: ModalController,
  private navController: NavController) {
    window.ActiveUsersPage = this;
  }

  async CreateActivepopup(index) {
    const popover = await this.activepopup.create({component:ActivepopupPage,
    componentProps:{"paramId":this.activeUsersList[index]},backdropDismiss:true});
    popover.onDidDismiss().then((res)=>{
      console.log(res);
      if(res.role == 'CloseChat'){
        this.closeChat(res);
      }if (res.role == 'MarkAsResolved'){
        this.MarkasResolved(res);
      }if (res.role == 'BackBtnAction'){
        this.backBtnAction();
      }
      else {

      }
    });
    return await popover.present();
  }
  

  backBtnAction(){
    this.platform.backButton.subscribeWithPriority(999999,() => {
      this.navController.back();
    });
  }
  
  
  ngOnInit() {
    console.log ("Active chat tab");
    console.log("ACTIVE",this.activeUsersList);
    console.log("selected bot",this.utils.getselectedbotList());
    this.selectedBot = this.utils.getselectedbotList();
    console.log("selected bot",this.selectedBot);
    console.log("selected bot id",this.selectedBot.id);
    let currentTime = new Date().getTime().toLocaleString();
    let global_scope = this;
    this.socket.on('setsession', function(k) {
      console.log("setsession response",k);
      let new_user = {
        bot_id: k.bot_id,
        bot_name: k.bot_name,
        channel: k.channel,
        device_print: k.device_print,
        ip_address: k.ip_address,
        notes: k.notes,
        session_id: k.session_id,
        time: currentTime,
        user_location: k.user_location,
        user_url: k.user_url,
        is_new: true,
        is_closed: k.is_closed,
        messages: k.messages
      }
      global_scope.addNewUser(new_user);
    });
    this.getActiveChatUsers(null);
  }
  

  ///***  Active bot button clicked action ***///
  addNewUser(new_user) {
    console.log("before inserting",this.activeUsersList);
    this.activeUsersList.push(new_user);
    console.log("after inserting",this.activeUsersList);
  }
  
 
  closeChat(new_user){
    console.log("activeuserslist before",this.activeUsersList);
    for (var val of this.activeUsersList) {
      console.log(val);
      let session_id1 = new_user.data.session_id;
      let session_id2 = val.session_id;
      if(session_id1.toLowerCase() === session_id2.toLowerCase()){
        val.is_closed = "1";
      }
    }
    console.log("activeuserslist after",this.activeUsersList);
  }
  

  MarkasResolved(new_user){
    console.log("activeuserslist before",this.activeUsersList);
    for (var val of this.activeUsersList) {
      console.log(val);
      let session_id1 = new_user.data.session_id;
      let session_id2 = val.session_id;
      if(session_id1.toLowerCase() === session_id2.toLowerCase()){
        this.activeUsersList.splice(this.activeUsersList.indexOf(new_user),1);
      }
    }
    console.log("activeuserslist after",this.activeUsersList);
  }
    
  
  ///*** Method to get active chat users ***///
  getActiveChatUsers(event) {
    this.utils.showLoader("Please wait while we fetch your Active Chat users list...");
    let body = new URLSearchParams();
    body.set('chatbot_id',this.selectedBot.id);
    body.set('is_closed', '0');
    this.apiservice.getLivechat(body.toString()).then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Active-Users page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
        if (event)
          event.target.complete();
      }else {
        this.activeUsersList = new Array<ChatUsersResponse>();
        this.activeUsersList = response.data.data;
        console.log("Active Users",this.activeUsersList);
        if (event)
          event.target.complete();
      }
      let currentTime = new Date().getTime().toLocaleString();
      console.log("Time",currentTime)
      let global_scope = this;
      this.socket.on('usersentmessage', function(m) {
        console.log(m);
        let new_user1 = {
          agent_id: m.agent_id,
          bot_id: m.bot_id,
          channel: m.channel,
          device_print: m.device_print,
          message: m.message,
          name: m.name,
          session_id: m.session_id,
          time: currentTime,
          type:'user',
          messages: m.messages
        }
        global_scope.addNewUser(new_user1);
      });
    });
  }
    
  ///***  Active bot button clicked action ***///
  activebotClicked(new_user1) {
    this.contentArea.scrollToBottom(500);
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
    console.log("User before",new_user1);
    this.utils.showLoader("Please wait while we fetch your Chat messages...");
    console.log("Session ID:",new_user1.session_id);
    console.log("ChatBot ID:",localStorage.getItem('chatbot_id'));
    console.log("Channel:",new_user1.channel);
    this.apiservice.getChatData(new_user1.session_id,localStorage.getItem('chatbot_id'),new_user1.channel).then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Active users Page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      } else {
        console.log("chat user response",(response as any).data);
        let chatmsgs = [];
        for(let  i = 0; i < ((response as any).data).answers.length; i++){
          if(((response as any).data).answers[i].question_text != ''){
            let new_user_obj = {
              agent_name : 'test - admin',
              created_at:new Date(new Date(((response as any).data).answers[i].created_at).getTime() - currentTime.getTimezoneOffset()*60000),
              text:((response as any).data).answers[i].question_text,
              type:'customer'
            }
            chatmsgs.push(new_user_obj);
          }
          if(((response as any).data).answers[i].answer_text != ''){
            let new_user_obj = {
              agent_name : 'test - admin',
              created_at:new Date(new Date(((response as any).data).answers[i].created_at).getTime() - currentTime.getTimezoneOffset()*60000),
              text:((response as any).data).answers[i].answer_text,
              type:'user'
            }
            chatmsgs.push(new_user_obj);
          }
        }
        for(let  i = 0; i < ((response as any).data).messages.length; i++){
          if(((response as any).data).messages[i].text != ''){
            let new_user_obj = {
              agent_name : '',
              created_at:new Date(new Date(((response as any).data).messages[i].created_at).getTime() - currentTime.getTimezoneOffset()*60000),
              text:((response as any).data).messages[i].text,
              type:((response as any).data).messages[i].type
            }
            chatmsgs.push(new_user_obj);
          }
        }
        console.log("New chat messages array",chatmsgs);
        new_user1.messages = chatmsgs;
        console.log("User after",new_user1);
        this.utils.setchatUserResponse(new_user1);
        this.route.navigate(['chatmessenger',{isfrmclosedchat:false}]);
        this.contentArea.scrollToBottom()
        {
          console.log("Scrolled to bottom");
        }
      }
    });
    this.apiservice.getresetUnreadCounter(new_user1.cb_session).then((response)=> {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Reset Unread Messages",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      } else {
        console.log("Success response in Reset Unread messages",(response as any).data);
      }
    })
  }


  @HostListener('loaded')
  pageOnInit() {
    console.log("Component is alive!");
  }@HostListener('unloaded')
  pageDestroy() {
    console.log("Component is dead!");
  }
}