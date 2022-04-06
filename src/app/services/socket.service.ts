import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  setsocketid(object:any){
    this.socket.emit('setsocketid',object);
  }

  senddevicetoken(object:any){
    this.socket.emit('senddevicetoken',object);
  }

  ///*** method to establish socket connection ***///
  startSocketConnection(){
    this.socket.connect();
  }

  ///*** method to stop socket connection ***///
  stopSocketConnection(){
    this.socket.disconnect();
  }

  ///*** Method to send message ***///
  sendMessage(object:any){
    console.log("Admin Send Message button action");
    this.socket.emit('adminsentmessage', object);
  }

  ///*** Method to set agent session ***///
  setagentsession(object:any){
    console.log("Set agent session action");
    this.socket.emit('setagentsession',object);
  }
   ///*** Method to user sent message ***///
  userSentMessage(object:any){
    console.log("User Send Message button action");
    this.socket.emit('userSentMessage',object);
  }
   ///*** Method to set  session ***///
  setsession(object:any){
    console.log("Set session action");
    this.socket.emit('setsession',object);
  }
   ///*** Method to close session from admin ***///
  closesessionfromadmin(object:any){
    console.log("Close Session from Admin");
    this.socket.emit('closesessionfromadmin',object);
  }
   ///*** Method for Mark As resolved ***///
  markresolved(object:any){
    console.log("markresolved");
    this.socket.emit('markresolved',object);
  }
   ///*** Method for Request Feedback ***///
  requestfeedback(object:any){
   console.log("requestfeedback");
   this.socket.emit('requestfeedback',object);
  }
   ///*** Method for set status event ***///
  setstatus(object:any){
    console.log("setstatus");
    this.socket.emit('setstatus',object);
  }
   ///*** Method for Submit Feedback Event ***///
  submitfeedback(object:any){
    console.log("submitfeedback");
    this.socket.emit('submitfeedback',object);
  }
   ///*** Method for Submit Feedback Message event ***///
  submitfeedbackmessage(object:any){
    console.log("submitfeedbackmessage");
    this.socket.emit('submitfeedbackmessage',object);
  }

///*** Method for Admin Typing event ***///
  admintyping(object:any){
    console.log("Admin typing  event called");
    this.socket.emit('admintyping',object);
  }

///*** Method for Admin typing stopped event ***///
  admintypingstopped(object:any){
    console.log("Admin typing stopped event called");
    this.socket.emit('admintypingstopped',object);
  }

///*** Method for User Typing event ***///
  usertyping(object:any){
    console.log("usertyping event called");
    this.socket.emit('usertyping',object);
  }

///*** Method for User Typing Stopped event ***///
  usertypingstopped(object:any){
    console.log("usertypingstopped event called");
    this.socket.emit('usertypingstopped',object);
  }
 
}
