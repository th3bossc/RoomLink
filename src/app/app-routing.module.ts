import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { ChatComponent } from './chat/chat.component';
import { AuthService } from './Services/auth.service';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path : '', redirectTo : 'home/welcome', pathMatch : 'full'},
  {path : 'home', component : HomeComponent, children : [
    {path : 'welcome', component : WelcomeComponent},
    {path : 'login', component : LoginComponent, data : { animation : 'isLeft' }},
    {path : 'register', component : RegisterComponent, data : { animation : 'isRight' }},
  ], data : {animation : 'dont'}},
  {path : 'profile', component : LandingComponent, canActivate : [AuthService], data : {animation : 'appear'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
