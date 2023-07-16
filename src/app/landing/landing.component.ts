import { Component, HostListener } from '@angular/core';
import { CommunicationService, User } from '../Services/communication.service';
import { slideInRight } from '../animations';

export interface roomInterface {
  id : string;
  name : string;
};


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations : [slideInRight]
})
export class LandingComponent {
  username: string;
  rooms : roomInterface[];
  variable = true;
  chatVisible : boolean = false;
  smallDisplay : boolean;
  constructor(private commService : CommunicationService) {}

  ngOnInit() {
    this.smallDisplay = window.innerWidth < 800;
    this.chatVisible = false;
    this.username = this.commService.currentUser.username;
    this.commService.socket.on('initiation-complete', () => {
      this.commService.getRoomsList().subscribe({
        next : (data) => {
          this.rooms = data.roomsList;
          console.log(this.rooms);
        },
        error : (error) => console.log(error)
      });
    });
    this.commService.socket.on('joined-room-successfully', () => {
      if (!this.rooms.find((room => room.id === this.commService.currentUser.roomId))) {
        this.commService.getRoomsList().subscribe({
          next : (data) => {
            this.rooms = data.roomsList;
          },
          error : (error) => console.log(error)
        })
      }
    })
    this.commService.socket.on('room-deleted', () => {
      this.commService.getRoomsList().subscribe({
        next : (data) => {
          this.rooms = data.roomsList;
        },
        error : (error) => console.log(error)
      })
    })
  }

  logout() {
    this.commService.logoutUser();
  }

  gotoRoom(index : number) {
    const {id, name} = this.rooms[index];
    this.commService.socket.emit('join-room', id);
    this.commService.currentUser.roomName = name;
    this.commService.currentUser.roomId = id;
    this.chatVisible = true;
  }

  viewAllChats(target : boolean) {
    if (!target)
      this.chatVisible = target;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.smallDisplay = (window.innerWidth < 800);
  }

  roomDeleted(target) {
    if (target) {
      this.commService.getRoomsList().subscribe(data => {
        this.rooms = data.roomsList;
      }) 
      this.chatVisible = false;
    }
  } 
}
