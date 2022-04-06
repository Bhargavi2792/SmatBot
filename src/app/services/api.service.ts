import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
import { LoginRequest } from '../Model/loginrequest';
import { ProfileSendRes } from '../Model/profilesendres';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  ///*** Method to validate login credentials ***///
  validateloginData(request:LoginRequest):Promise<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
      })
    }
    return new Promise(resolve =>{
      this.http.post('https://www.app.smatbot.com/kya_backend/app/login',request,httpOptions).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
  

  ///*** Method to getChatbots list ***///
  getChatbots():Promise<any> {
    let httpBotlist = {
      headers: new HttpHeaders({
         'Authorization': localStorage.getItem('token')
      })
    }
    return new Promise(resolve =>{
      this.http.get('https://www.app.smatbot.com/kya_backend/settings/getChatbots',httpBotlist).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("token",localStorage.getItem('token'));
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
  
  ///*** Method to Livechat list ***///
  getLivechat(request:string):Promise<any> {
   let httpLiveChatlist = {
      headers: new HttpHeaders({
         'Authorization': localStorage.getItem('token'),
         'Content-Type': 'application/x-www-form-urlencoded',
         'Accept':'application/json'
      })
    }
    return new Promise(resolve =>{
      this.http.post('https://www.app.smatbot.com/kya_backend/livechat/getLivechatSession',request,httpLiveChatlist).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
  
  ///*** Method to ProfileServicelist ***///
  getProfileService(request: ProfileSendRes):Promise<any> {
    let httpProfileService = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json',
        'Accept':'application/json'
      })
    }
    return new Promise(resolve =>{
      this.http.post('https://www.app.smatbot.com/kya_backend/app/profileService',request,httpProfileService).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
  
  
  ///*** Method to GetChatData ***///
  getChatData(sessionId,chatbotId,channel):Promise<any> {
    let httpChatData = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
     })
    }
    console.log("URL",'https://www.app.smatbot.com/kya_backend/livechat/getChatdata?cb_session='+ sessionId + '&chatbot_id=' + chatbotId + '&channel=' + channel);
    return new Promise(resolve =>{
      this.http.get('https://www.app.smatbot.com/kya_backend/livechat/getChatdata?cb_session='+ sessionId + '&chatbot_id=' + chatbotId + '&channel=' + channel,httpChatData).subscribe(response => {
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
  

  ///*** Method to GetSetStatus ***///
  getSetStatus(request: ProfileSendRes):Promise<any> {
    let httpSetStatus = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json',
        'Accept':'application/json'
      })
    }
    return new Promise(resolve =>{
      this.http.post('https://www.app.smatbot.com/kya_backend/livechat/setStatus',request,httpSetStatus).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }


  ///*** Method to Get Assigned Sessions ***///
  getAssignedSessions():Promise<any> {
    let httpgetAssignedSessions = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')
     })
    }
    return new Promise(resolve =>{
      this.http.get('https://www.app.smatbot.com/kya_backend/livechat/getAssignedSessions ',httpgetAssignedSessions).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }


  ///*** Method to Get Agent Status ***///
  getAgentStatus():Promise<any> {
    let httpAgentStatus = {
      headers: new HttpHeaders({
         'Authorization': localStorage.getItem('token')
      })
    }
    return new Promise(resolve =>{
      this.http.get('https://www.app.smatbot.com/kya_backend/livechat/getAgentsStatus',httpAgentStatus).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("token",localStorage.getItem('token'));
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }


  ///*** Method to GetUploadImage ***///
  getUploadImage(request):Promise<any> {
    let httpImageUpload = {
      headers : new HttpHeaders({
        'Content-Type':'application/x-www-form-urlencoded'
      })
    }
    let body = "data=" +request.data + "&file_name=" + request.file_name +"&profile_id=" + request.profile_id;
    return new Promise(resolve =>{
      this.http.post('https://www.smatbot.com/kya_backend/Api/uploadImageFile',body,httpImageUpload).subscribe(response => {
        console.log("Response",response);
        let responseInfo: any = {};
        responseInfo.errorStatus = false;
        responseInfo.data = response;
        resolve(responseInfo);
      },error => {
        console.log("Response error",error);
        console.log("Response error",error.status);
        let responseInfo: any = {};
        responseInfo.errorStatus = true;
        responseInfo.data = error;
        resolve(responseInfo);
      });
    });
  }
}
 