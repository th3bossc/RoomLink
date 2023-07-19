import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '../Services/communication.service';
import { Message } from 'primeng/api';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  roomForm : FormGroup;
  messages : Message[] = [];
  socket : Socket;
  ngOnInit() {
    this.socket = this.commService.socket;
    this.roomForm = new FormGroup({
      roomName : new FormControl(null, [Validators.required]),
    })
  }
  constructor(private commService : CommunicationService) {}

  onSubmit(buttonType) {
    const { roomName } = this.roomForm.value;
    if (buttonType === 'create') {
      this.commService.createRoom(roomName).subscribe({
        next : (data) => {
          console.log(data);
          this.next(data, roomName);
        },
        error : (error) => {
          console.log(error);
          this.messages = [
            { severity: 'error', summary: 'Error', detail: error.error.message },
          ]
        },
      });
    }
    else if (buttonType === 'join') {
      this.commService.joinRoom(roomName).subscribe({
        next : data => {
          this.next(data, roomName);
        },
        error : (error) => {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: error.error.message },
          ]
        },
      })
    }
    this.roomForm.reset();
  }

  next(data, roomName) {
    this.socket.emit('join-room', data['roomId'], this.commService.currentUser.roomId);
    this.commService.currentUser.roomName = roomName;
    this.commService.currentUser.roomId = data['roomId'];
    console.log(this.commService.currentUser.roomName);
  }
}
