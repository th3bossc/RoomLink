import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommunicationService } from './Services/communication.service';
import { AuthService } from './Services/auth.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { RoomComponent } from './room/room.component';
import { ChatComponent } from './chat/chat.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    LandingComponent,
    RoomComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
		SocketIoModule.forRoot(config), 
    RippleModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    OverlayPanelModule,
    TagModule,
    ConfirmPopupModule,
    ToastModule,
    ToolbarModule,
  ],
  providers: [CommunicationService, SocketIoModule, AuthService, ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
