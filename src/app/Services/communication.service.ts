import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { messageInterface, userInterface } from '../chat/chat.component';
import { roomInterface } from '../landing/landing.component';
import { Router } from '@angular/router';

export interface User {
  username : string;
  roomId ?: string;
  roomName ?: string;
  accessToken : string;
  recentRooms : {name : string, id : string}[];
};


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  currentUser : User;
  url : string = environment.apiUrl;
  headers : HttpHeaders = null;
  constructor(public socket : Socket, private http : HttpClient, private router : Router) {}


  registerUser(username : string, password : string) {
    console.log(username, password);
    return this.http.post(this.url + 'user/register', {username, password});
  }

  loginUser(username : string, password : string) {
    return this.http.post(this.url + 'user/login', {username, password});
  }

  logoutUser() {
    this.currentUser = null;
    this.headers = null;
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    this.socket.disconnect();
    this.socket.connect();
    this.router.navigate(['/']);
  }

  initiateUser() {
    if(this.currentUser.username) {
      this.headers = new HttpHeaders({
        'Authorization' : `Bearer ${this.currentUser.accessToken}`,
      });
      this.socket.emit('initiate', this.currentUser.username);
    }
  }

  online() : Observable<any> {
    return this.http.get(this.url + 'user/online');
  }


  tryLogin() : Observable<any> {
      const headers = new HttpHeaders({
        'Authorization' :  `Bearer ${localStorage.getItem('accessToken')}`
      })
      return this.http.get(this.url + 'user/current', {headers});
  }

  importUser() {
    if (localStorage.getItem('username'))
      this.currentUser = {username : localStorage.getItem('username'), accessToken : localStorage.getItem('accessToken'), recentRooms : []};
  }

  createRoom(roomName : string) {
    return this.http.post(this.url + 'room/new', {newRoomName : roomName}, {headers : this.headers});
  }

  joinRoom(roomName : string) {
    return this.http.get(this.url + `room/${roomName}`, {headers : this.headers});
  }

  deleteRoom(roomName : string) {
    return this.http.delete(this.url + `room/${roomName}`, {headers : this.headers});
  }

  getRoomsList() {
    return this.http.get<{roomsList : roomInterface[]}>(this.url + `room/rooms/${this.currentUser.username}`, {headers : this.headers});
  }

  getUsersList(roomId : string) {
    return this.http.get<{usersList : userInterface[]}>(this.url + `room/users/${roomId}`, {headers : this.headers});
  }

  getMessageHistory(roomId : string) {
    return this.http.get<{previousMessages : messageInterface[]}>(this.url + `room/messages/${roomId}`, {headers : this.headers});
  }

  sendMessage(content : string) {
    this.socket.emit('new-message', content);
  }

}
