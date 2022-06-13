import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RecaptchaComponent, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { PopovercomponentPageModule } from './popovercomponent/popovercomponent.module';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from "@ionic-native/base64/ngx";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';



const config: SocketIoConfig = { url: 'https://www.smatbot.com:8000', options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    RecaptchaModule,
    CommonModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot({driverOrder: ['localstorage']}),
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PopovercomponentPageModule,
    Ng2SearchPipeModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PhotoViewer,
    FileChooser,
    Base64,
    File,
    FileTransfer

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

