import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators,FormArray,FormArrayName,ValidationErrors }  from '@angular/forms';
import { ChatUsersResponse } from '../../Model/chatusersresponse';
import { UtilsService } from '../../services/utils.service';
import { IonContent, IonInfiniteScrollContent, PopoverController,Platform,ActionSheetController,IonBadge } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { PopovercomponentPage } from '../../popovercomponent/popovercomponent.page';
import { ToastController } from '@ionic/angular';
import { SocketService } from '../../services/socket.service';
import { BotList } from 'src/app/Model/botList';
import { Messages } from '../../Model/messages';
import { ActivepopupPage } from '../../activepopup/activepopup.page';
import { Router,ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ImageUpload } from 'src/app/Model/imageupload';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Capacitor } from '@capacitor/core';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


declare var window;
@Component({
  selector: 'app-chatmessenger',
  templateUrl: './chatmessenger.page.html', 
  styleUrls: ['./chatmessenger.page.scss'],
})
export class ChatmessengerPage  {
  @ViewChild('content') private content: any;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo = "";
  messageDateString = "";
  isDesktop: boolean;
  footerForm: FormGroup;
  chatUser: ChatUsersResponse;
  currentOne: '';
  message = '';
  messages = [];
  currentUser = '';
  selectedBot:BotList;
  activeUsersList:Array<ChatUsersResponse>;
  showMsg = true;
  newMsg = '';
  isFrmClosedChat= '';
  isStartedTyping= false;
  typing:string;
  chats= [];
  uid='';
  otherUid= '';
  capturedImage = '';
  picImage;
  imagePath:SafeUrl;
  imgUrl: '';
  dateTime;
  croppedImagepath = "";
  isLoading = false;
  title:string;
  dataReader:any;
  yourImageDataURL:any;
  imageURI: any;
  imageFileName: any;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  constructor(private formBuilder: FormBuilder,
  public utils:UtilsService,
  public socketservice:SocketService,
  public popoverController: PopoverController,
  private popover:PopoverController,
  private socket: Socket,
  private activepopup:PopoverController,
  private toastCtrl:ToastController,
  private _Activatedroute:ActivatedRoute,
  private route : Router,
  private apiservice: ApiService,
  private actionSheetController: ActionSheetController,
  private sanitizer: DomSanitizer,
  private http: HttpClient,
  private platform: Platform,
  private storge: Storage,
  private photoViewer: PhotoViewer,
  private backgroundMode: BackgroundMode,
  private file: File,
  private transfer: FileTransfer) { }
  

  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    console.log('Image:',image);
    this.photo = image.base64String;
    let request: ImageUpload = new ImageUpload();
    request.data = this.photo;
    let timestamp:any = new Date().getTime().toLocaleString();
    console.log('Timestamp',timestamp);
    let ext = 'jpeg';
    timestamp = timestamp + '.' + ext;
    request.file_name = timestamp;
    request.profile_id = '99';
    this.apiservice.getUploadImage(request).then((response) => {
      console.log("Response",response);
      this.utils.hideLoader();
      if((response as any).errorStatus) {
        console.log("Failure response in Image Upload ",response);
        this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
      }else {
        this.imgUrl = response.data.url;
        console.log("Image URl",this.imgUrl);
        this.photo = 'live_chat_image_upload;;'+ this.imgUrl;
        this.sendMessageBtnAction();
      }
    });
  }
  

  uploadPhoto(fileChangeEvent) {
    const photo = fileChangeEvent.target.files[0];
    let formData = new FormData();
    formData.append("photo", photo, photo.name);
  }


  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {

        }
      },
      {
        text: 'Use Camera',
        handler: () => {

        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
  

  isCustomerImgAvbl(msg):boolean { 
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msg[1];
    if(imgName === 'live_chat_image_upload') {
      return imgUrl;
    }
    else{
      return false;
    }
  }
  

  getsanitizedUrl(msg):boolean{
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msgs[1];
    return imgUrl;
  }
  

  isImgAvbl(msg):boolean {
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msgs[1];
    if(imgName === 'live_chat_image_upload') {
      return true;
    }
    else {
      return false;
    }
  }


  isUrlAvbl(msg):boolean {
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msgs[1];
    if(imgName === '/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g'){
      return true;
    }
    else{
      return false;
    }
  }
  

  getImgUrl(msg):boolean {
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msgs[1];
    return imgUrl;
  }
  

  showUserDetails(ev){
    this.popover.create({component:PopovercomponentPage,
    event: ev,showBackdrop:true}).then((popoverElement)=>{
      popoverElement.present();
    })
  }
  
  
  async CreateActivepopup(ev){
    const popover = await this.activepopup.create({component:ActivepopupPage,
    event: ev,componentProps:{"paramId":this.chatUser},backdropDismiss:true});
    popover.onDidDismiss().then((res)=>{
      console.log("Response",res);
      if(res.role == 'CloseChat'){
        window.ActiveUsersPage.closeChat(res);
        this.route.navigate(['tabs']);
      }if (res.role == 'MarkAsResolved'){
        window.ActiveUsersPage.MarkasResolved(res);
        this.route.navigate(['tabs']);
      }else {

      }
    });
    return await popover.present();
  }
  
  
  ngOnInit() {
    this.socket.removeAllListeners();
    this.socket.on('usertyping',function(n){
      console.log("User typing started");
      console.log(n);
        if(this.isStartedTyping = true){
          this.typing = 'typing...';
          console.log(this.typing);
        }
        console.log("user",this.isStartedTyping);
    });
    this.socket.on('usertypingstopped',function(k){
      console.log("User typing stopped");
      console.log(k);
    });
    this.chatUser = this.utils.getchatUserResponse();
    this.selectedBot = this.utils.getselectedbotList();
    this.title = this.chatUser.ip_address;
    console.log("Selected Chat User",this.chatUser);
    this._Activatedroute.paramMap.subscribe(params =>{
      console.log("Value",params.get('isfrmclosedchat'));
      this.isFrmClosedChat = params.get('isfrmclosedchat');
    });
    if(this.isFrmClosedChat === 'false'){
      console.log("isfrom closd chats",this.isFrmClosedChat);
      console.log("Form validations");
      this.setFormValidation();
    }
    let global_scope = this;
    this.socket.on('usersentmessage', function(m) {
      console.log(m);
      if (m.session_id == global_scope.chatUser.session_id ){

      }
      let currentTime = new Date().toLocaleString();
      let msgObj = {
        text: m.message,
        type:'user',
        agent_name: global_scope.chatUser.agent_name,
        created_at : currentTime,
        bot_id:m.bot_id
      }
      if (global_scope.chatUser.messages && global_scope.chatUser.messages.length > 0) {

      }
      else {
        global_scope.chatUser.messages = new Array<Messages>();
      }
      global_scope.chatUser.messages.push(msgObj);
      console.log("MSG Object",msgObj);
    });
    this.socket.on('closesession', function(n){
      console.log(n);
      if (global_scope.chatUser.session_id && n.global_scope.chatUser.session_id ) {
        this.footerForm.disable();
      }
      else{
        global_scope.chatUser.messages = new Array<Messages>();
      }
    });
  }
  

  clickImage(image){
    console.log("Image Clicked",image);
    this.photoViewer.show(image);
  }

  
  unreadMsgs(){
    let newMsg = '';
    let msgCount = newMsg.length;
    let msgs = msgCount;
  }

  
  setmsgText(msg):string {
    let msgs = msg.split(";;");
    let imgName = msgs[0];
    let imgUrl = msgs[1];
    if(imgName==='live_chat_image_upload'){
      return imgUrl;
    }
    else{
      return msg;
    }
  }

  
  addNewUser(new_user) {
    console.log("Before Inserting",this.activeUsersList);
    this.activeUsersList.push(new_user);
    console.log("After Inserting",this.activeUsersList);
  }
  
    
  ///*** method to set form validations ***///
  setFormValidation() {
    this.footerForm = this.formBuilder.group({
      inputText: ["", Validators.required]
    });
  }
  

  ///*** Send message btn action ***///
  sendMessageBtnAction(){
    let body = new URLSearchParams();
    body.set('chatbot_id',this.selectedBot.id);
    console.log("Send Message Button Action");
    console.log("Entered Text",this.footerForm.value.inputText);
    let newObj = '';
    if(this.photo!==''){
      newObj = this.photo;
    }
    else{
      newObj = this.footerForm.value.inputText;
    }
    let currentTime = new Date().toISOString();
    console.log("Current date",currentTime);
    this.footerForm.reset();
    let chatUser = this.utils.getchatUserResponse();
    let obj = {
      session_id: chatUser.session_id,
      device_print: chatUser.device_print,
      type: 'user',
      channel: chatUser.channel,
      user_number: '',
      agent_name:chatUser.agent_name,
      agent_id: chatUser.agent_ids,
      time: currentTime,
      message: newObj,
      chatbot_id: this.selectedBot.id
    }
    console.log(obj);
    console.log("time",obj.time);
    this.content.scrollToBottom();
    this.socketservice.sendMessage(obj);
    let msgObj = {
      text: newObj,
      type:'customer',
      agent_name : chatUser.agent_name,
      created_at :  currentTime,
      message : newObj
    }
    if (this.chatUser.messages && this.chatUser.messages.length > 0) {
    }
    else {
      this.chatUser.messages = new Array<Messages>();
    }
    this.chatUser.messages.push(msgObj);
    console.log("Chat user messages",this.chatUser.messages);
    this.content.scrollToBottom(500);
    this.photo = '';
  }

  adminStartedTyping() {
    if(this.footerForm.value.inputText !=''){
      console.log("Admin started typing method called");
      this.socket.on('admintyping',function(k){
        console.log("Admin typing",k);
      });
    }
    else{
      console.log("Admin stopped typing method called");
      this.socket.on('admintypingstopped',function(l){
        console.log("Admin typing stopped",l);
      });
    }
  }


  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) return true;
    const d1 = new Date(this.messages[messageIndex - 1].timeStamp);
    const d2 = new Date(this.messages[messageIndex].timeStamp);
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }


  getMessageDate(messageIndex: number): string {
    let dateToday = new Date().toDateString();
    let longDateYesterday = new Date();
    longDateYesterday.setDate(new Date().getDate() - 1);
    let dateYesterday = longDateYesterday.toDateString();
    let today = dateToday.slice(0, dateToday.length - 5);
    let yesterday = dateYesterday.slice(0, dateToday.length - 5);
    const wholeDate = new Date(
      this.messages[messageIndex].timeStamp
    ).toDateString();
    this.messageDateString = wholeDate.slice(0, wholeDate.length - 5);
    if (new Date(this.messages[messageIndex].timeStamp).getFullYear() ===new Date().getFullYear()) {
      if (this.messageDateString === today) {
        return "Today";
      } else if (this.messageDateString === yesterday) {
        return "Yesterday";
      } else {
        return this.messageDateString;
      }
    } else {
      return wholeDate;
    }
  }
}
