import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { CommunicationService } from '../Services/communication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface userInterface {
  username : string;
  online : boolean;
};

export interface messageInterface {
  time : Date;
  content : string;
  sender : userInterface;
};




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  constructor(private commService : CommunicationService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
  username : string;
  room : string;
  messages : messageInterface[];
  users : userInterface[];
  @Output() goBack = new EventEmitter<boolean>();
  @Output() deleteCurrentRoom = new EventEmitter<boolean>();
  @ViewChild('messageWindow') pageBottom : ElementRef;
  inputForm : FormGroup;
  
  
  ngOnInit() {

    this.username = this.commService.currentUser.username;
    this.inputForm = new FormGroup({
      input : new FormControl(null, [Validators.required]),
    })
    if (!this.room)
      console.log('Enter a room to chat');
    this.commService.socket.on('joined-room-successfully', () => {
      this.room = this.commService.currentUser.roomName;
      this.updateMessageHistory();
      this.updateUserList();
    })

    this.commService.socket.on('user-connected', () => this.updateUserList());
    this.commService.socket.on('user-disconnected', () => this.updateUserList());
    this.commService.socket.on('incoming-message', () => this.updateMessageHistory());
    this.commService.socket.on('current-room-deleted', () => {
      this.messageService.add({ severity : 'success', summary : 'Accepted', detail : 'Room deleted successfully'});
      this.deleteCurrentRoom.emit(true);
      this.commService.currentUser.roomId = null, this.commService.currentUser.roomName = null;
      this.room = null;
    })
  }

  scrollDown() {
    this.pageBottom.nativeElement.scrollTop = this.pageBottom.nativeElement.scrollHeight;
  }

  ngAfterViewChecked(): void {
    if (this.pageBottom)
      this.scrollDown();
  }
  onSubmit() {
    const content = this.inputForm.value['input'];
    this.commService.sendMessage(content);
    this.inputForm.reset();
  }
  
  updateMessageHistory() {
    this.commService.getMessageHistory(this.commService.currentUser.roomId).subscribe({
      next : (data) => this.messages = data.previousMessages,
      error : error => console.log(error),
    }) 
  }

  updateUserList() {
    this.commService.getUsersList(this.commService.currentUser.roomId).subscribe({
      next : data => this.users = data.usersList,
      error : error => console.log(error),
    })
  }

  goToAllChats() {
    this.goBack.emit(false);
  }

  deleteRoom(event : Event) {
    this.confirmationService.confirm({
      target : event.target as EventTarget,
      message : 'Once deleted, the chats can never be recovered again. Do you wish to proceed?',
      icon : 'pi pi-exclamation-triangle',
      accept : () => {
        this.commService.socket.emit('delete-room');
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Room not deleted' });
      }
    })
  }
}




