import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuController, Platform ,IonRouterOutlet,AlertController, NavController,PopoverController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UtilsService} from '././services/utils.service';
import { NavigationStart, Router } from '@angular/router';
import { SocketService } from '././services/socket.service';
import { ApiService } from '././services/api.service';
import { ProfileSendRes } from 'src/app/Model/profilesendres';
import { ProfileResponse } from 'src/app/Model/profileresponse';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Location } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// import { FCM } from "@capacitor-community/fcm";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
// if (isPushNotificationsAvailable) {
//   this.initPushNotifications();
// }


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  profileresponselist: Array<ProfileResponse>;
  profilesendres: Array<ProfileSendRes>;
  pages :any;
  status :string;
  token :string;


  constructor(private platform: Platform,
  private splashScreen: SplashScreen,
  private statusBar: StatusBar,
  public utils:UtilsService,
  private route : Router,
  public socket:SocketService,
  private menu:MenuController,
  private apiservice : ApiService,
  private backgroundMode: BackgroundMode,
  private alertController: AlertController,
  private location: Location,
  private navController: NavController,
  private popover: PopoverController
  ){
    this.initializeApp();
    this.backBtnAction();
  }
  initializeApp() {
    this.platform.ready().then(() => { 
      this.pages = [ 
        {name:'Live Chat Status',icon:false,showToggle:true},
        {name:'Logout',icon:true,showToggle:false}
      ];
      this.statusBar.styleDefault();
      this.splashScreen.hide();     
      this.socket.startSocketConnection();
      this.backgroundMode.enable();
      if(localStorage.getItem("isLoggedIn") === "true"){
        this.socket.startSocketConnection();
        this.status = localStorage.getItem("agent_status");
        this.socket.setagentsession({agent_id:localStorage.getItem("agent_id"),
        agent_name:localStorage.getItem("agent_name"),
        agent_status:localStorage.getItem("agent_status"),
        token:localStorage.getItem("token")});
        this.route.navigate(['botslist']);
      }


      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',(devicetoken: Token) => {
        // alert('Push registration success, token: ' + token.value);
        console.log('Token',devicetoken.value);
        this.socket.senddevicetoken({agent_id:localStorage.getItem("agent_id"),
      devicetoken:devicetoken.value});
      localStorage.setItem("devicetoken",devicetoken.value);

      }
      );
      
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',(error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
      );
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
      async (data: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(data));
        
      }
      );
      
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Push action performed: ' + JSON.stringify(notification.notification));
        if(data.detailsId){
          this.route.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
      );
      
      this.utils.getagentStatusData().subscribe((data) => {
        console.log('Data received', data);
        this.status = data.agentStatus;
        this.setToggleStatus();
      });
    });
  }
  
  setToggleStatus():boolean{
    if(this.status == 'online'){
      return true;
    } else {
      return false;
    }
  }
  
  invokeService(request,status){
    let currentTime = new Date();
    this.apiservice.getSetStatus(request).then((response) => {
      console.log(response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Menu page",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      } else {
        this.apiservice.getAssignedSessions().then((response) => {
          console.log(response);
          this.utils.hideLoader();
          if((response as any).errorStatus) {
            console.log("Failure response in Menu page",response);
            this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
          }else {
            this.socket.setstatus({
              agent_id : response.data.agent_id,
              agent_name : response.data.agent_name,
              time : currentTime,
              status : response.data.status,
              assigned_sessions : response.data.assigned_sessions
            })
          }
        });
      }
    });
  }
  
  // backBtnAction(){
  //   this.platform.backButton.subscribeWithPriority(999999,async() => {
  //     if(this.popover.getTop()){
  //       const pop = await this.popover.getTop();
  //       console.log(pop);
  //       if(pop){
  //         this.popover.dismiss();
  //         return;
  //       }else{
  //         const url = this.route.url;
  //         console.log("url",url);
  //         if (url === '/botslist') {
  //           navigator['app'].exitApp();
  //         } else 
  //         if (url === '/login') {
  //           navigator["app"].exitApp();
  //         } else if (url === '/tabs/tabs/active-users') {
  //           this.route.navigate(['botslist']);
  //         } else if (url === '/tabs/tabs/closed-users') {
  //           this.route.navigate(['botslist']);
  //         } else if (url === '/chatmessenger;isfrmclosedchat=false'){
  //           this.route.navigate(['/tabs/tabs/active-users']);
  //         } else if (url === '/chatmessenger;isfrmclosedchat=true'){
  //           this.route.navigate(['/tabs/tabs/closed-users']);
  //         }
  //         else{
  //           this.navController.pop();
  //         }
  //       }
  //     }else{
  //       const url = this.route.url;
  //       if(url ==='/botlist'){
  //         navigator['app'].exitApp();
  //       }else{
  //         this.navController.pop();
  //       }
  //     }
  //   });
  // }
  backBtnAction(){
    this.platform.backButton.subscribeWithPriority(10,(processNextHandler) => {
      const url = this.route.url;
      console.log("url",url);
      if (url === '/botslist') {
          navigator['app'].exitApp();
          processNextHandler();
      } else if (url === '/login') {
        navigator['app'].exitApp();
      } else if (url === '/tabs/tabs/active-users') {
        this.route.navigate(['botslist']);
      } else if (url === '/tabs/tabs/closed-users') {
        this.route.navigate(['botslist']);
      } else if (url === '/chatmessenger;isfrmclosedchat=false'){
        this.route.navigate(['/tabs/tabs/active-users']);
      } else if (url === '/chatmessenger;isfrmclosedchat=true'){
        this.route.navigate(['/tabs/tabs/closed-users']);
      }
      else{
        // this.navController.back();
      }
    });
  }

  logoutbtnAction(p) {
    if(p.name === 'Logout'){
      this.menu.close();
      this.showal();
    }
  }
  
  showal(){
    this.utils.showconfirmationalert('Confirmation','Are you sure! You want to logout','Logout','Cancel').then(response => {
      if(response) {
        console.log("Ok button clicked");
        localStorage.setItem("isLoggedIn","false");
        this.route.navigate(['login']);
      } else {
        console.log("Cancel button clicked");
      }
    });
  }
  
  change(event){
    let currentTime = new Date();
    let request:any;
    if(event.target.checked) {
      request = {agent_id : localStorage.getItem("agent_id"),mode:'online'};
      console.log("toggle on");
      this.invokeService(request,'online');
    }
    else{
      request = {agent_id : localStorage.getItem("agent_id"),mode:'away'};
      this.invokeService(request,'offline');
    }
  }
}