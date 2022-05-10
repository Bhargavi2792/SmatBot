import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilsService } from '../../services/utils.service';
import { LoginRequest } from '../../Model/loginrequest';
import { FormGroup, FormControl, FormBuilder, Validators  }  from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { SocketService }  from '../../services/socket.service';
import { ProfileSendRes } from 'src/app/Model/profilesendres';
import { Platform,ActionSheetController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})  
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  subscribe:any;
  pushes: any = [];
  croppedImagepath = "";
  isLoading = false;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  public showPassword: boolean = false;
  constructor(private route : Router,
  public apiservice:ApiService,
  private _formBuilder: FormBuilder,
  public utils:UtilsService,
  private socket:SocketService,
  private platform:Platform,
  public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.setFormValidations();
  }

  hideShowPassword() {
    this.showPassword = !this.showPassword;
  }
  
  setFormValidations(){
    this.loginForm = this._formBuilder.group({
      userNameField: ["", Validators.required],
      pswrdField: ["", Validators.required]
    });
  }
  
  ///*** Sign-in button action ***///
  signinbtnclicked() {
    this.utils.showLoader("Please wait while we are logging you in...");
    console.log("SignIn button clicked");
    let request: LoginRequest = new LoginRequest();
    request.email = this.loginForm.value.userNameField;
    request.password = this.loginForm.value.pswrdField;
    request.key = 'feltso0BPm9bLi4z9DVqi';
    request.action = 'verify_authentication';
    request.recaptcha_response = 'abc12345';
    request.source = 'mobile';
    console.log ("Login Request",request);
    this.apiservice.validateloginData(request).then((response) => {
      if((response as any).errorStatus) {
        this.loginForm.reset();
        this.utils.hideLoader();
        console.log("Failure response in login page",response);
        console.log("Failure response status in login page",(response as any).data.status);
        console.log("Failure response message in login page",(response as any).data.message);
        if((response as any).data.status == 400){
          this.utils.showalert('Invalid Credentials','Invalid Username/Password','Ok');
        } else {
          this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
        }
      } else {
        this.loginForm.reset();
        console.log("token",(response as any).data.AuthToken);
        localStorage.setItem("token",(response as any).data.AuthToken);
        console.log("Success response in login page",(response as any).data);
        this.socket.startSocketConnection();
        this.socket.setsocketid({id:(response as any).data.AuthToken});
        let request: ProfileSendRes = new ProfileSendRes();
        request.action = 'read';
        this.apiservice.getProfileService(request).then((response) => {
          console.log(response);
          localStorage.setItem("response",response.data);
          this.utils.hideLoader();
          if((response as any).errorStatus) {
            console.log("Failure response in login page",response);
            this.utils.showalert('Error','Something went wrong please try again after sometime','Ok');
          } else {
            this.socket.setagentsession({agent_id:response.data.agent_id,
            agent_name: response.data.full_name,
            agent_status:(response as any).data.agent_status,
            token:(response as any).data.AuthToken});
            localStorage.setItem("agent_id",(response as any).data.agent_id);
            localStorage.setItem("full_name",(response as any).data.full_name);
            localStorage.setItem("agent_status",(response as any).data.agent_status);
            localStorage.setItem("email",(response as any).data.email);
            localStorage.setItem("isLoggedIn","true");
            this.route.navigate(['botslist']);
          }
        });
      }
    })
  } 
  
  ///*** forgot pswrd button action ***///
  forgotpswrdbtnclicked(){
    console.log("Forgot password button clicked");
    this.route.navigate(['forgot-password']);
  }
  
  ///*** sign Up button action ***///
  signupdbtnclicked(){
    console.log("Sign Up button clicked");
    this.route.navigate(['sign-up']);
  }
   
  initForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      key: new FormControl('',[Validators.required]),
      action : new FormControl('',[Validators.required]),
      recaptcha_response : new FormControl('',[Validators.required]),
      source: new FormControl('',[Validators.required])
    })
  } 
}
 