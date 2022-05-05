import { Injectable } from '@angular/core';
import { AlertController,LoadingController} from '@ionic/angular';
import { BotList} from '../Model/botList';
import { ChatUsersResponse } from '../Model/chatusersresponse';
import { ProfileResponse} from '../Model/profileresponse';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  selectedbot:BotList;
  chatUser:ChatUsersResponse;
  profileresponselist: ProfileResponse;
  feedbackRating = '';
  feedbackMsg = '';
  private agentStatus = new Subject<any>();
  private fullName = new Subject<any>();
  private agentId = new Subject<any>();
  private email = new Subject<any>();
  private token = new Subject<any>();


  constructor(public alertController: AlertController,public loadingCtrl: LoadingController) { }
  public async showalert(alerttitle:string,alertmessage:string,alertbtntitle:string){
    const alert = await this.alertController.create({
      header: alerttitle,
      message: alertmessage,
      buttons: [alertbtntitle]
    });
    await alert.present();
  }
  public async showconfirmationalert(alerttitle:string,alertmessage:string,okbtntitle:string,cancelbtntitle:string):Promise<boolean>{
    return new Promise(async (resolve, reject) =>{
      const confirm = (await this.alertController.create({
        header: alerttitle,
        message: alertmessage,
        backdropDismiss:false,
        buttons:[{
          text: okbtntitle,
          handler: () => {
            console.log('Confirm Okay');
            resolve(true);
          }
        },{
          text: cancelbtntitle,
          handler: () => {
            console.log('Confirm Cancel: blah');
            resolve(false);
          }
        }]
      })).present();
    })
  }
  
  // Show the loader for infinite time
  showLoader(message:string) {
    this.loadingCtrl.create({
      message: message,
      spinner:"circles"
    }).then((res) => {
      res.present();
    });
  }
  
  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingCtrl.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }
  
  ///*** method to set selected bot list ***///
  setselectedbotList(bot:BotList){
    this.selectedbot = bot;
  }
  
  ///*** method to get selected bot list ***///
  getselectedbotList(){
    return this.selectedbot;
  }
  
  ///*** Method to set chat user response ***///
  setchatUserResponse(new_user:ChatUsersResponse) {
    this.chatUser = new_user;
  }
  
  ///*** Method to get chat user response ***///
  getchatUserResponse() {
    return this.chatUser;
  }
  
  setProfileResponse(user:ProfileResponse){
    this.profileresponselist = user;
  }
  
  getProfileResponse(){
    return this.profileresponselist;
  }
  
  setfeedbackRating(rating:any){
    this.feedbackRating = rating;
  }
  
  getfeedbackRating(){
    return this.feedbackRating;
  }
  
  setfeedbackMsg(message:string){
    this.feedbackMsg = message;
  }
  
  getfeedbackMsg(){
    return this.feedbackMsg;
  }
  
  setagentStatusData(data: any) {
    this.agentStatus.next(data);
    console.log("agent status",data);
  }
  
  getagentStatusData(): Subject<any> {
    return this.agentStatus;
  }
  
  setagentId(data: any){
    this.agentId.next(data);
  }

  getagentId(): Subject<any>{
    return this.agentId;
  }

  setemail(data: any){
    this.email.next(data);
  }

  getemail(): Subject<any>{
    return this.email;
  }

  setfullName(data: any){
    this.fullName.next(data);
  }

  getfullName(): Subject<any>{
    return this.fullName;
  }

  settoken(data: any){
    this.token.next(data);
  }

  gettoken(): Subject<any>{
    return this.token;
  }


}

