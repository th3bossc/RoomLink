import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommunicationService } from '../Services/communication.service';
import { Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading : boolean;
  loginForm : FormGroup;
  messages : Message[];
  constructor(private commService : CommunicationService, private activatedRoute : ActivatedRoute, private router : Router) {}

  ngOnInit() {
    this.loading = false;
    this.loginForm = new FormGroup({
      username : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      password : new FormControl(null, [Validators.required, Validators.minLength(8)]),
    })
    this.activatedRoute.queryParams .subscribe((params) => {
      if (params['newUser'] === "true") {
        this.messages = [
          { severity: 'success', summary: 'Success', detail: 'User created Successfully! Please LogIn' },
        ]
      }
    })
  }

  onSubmit() {
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.commService.loginUser(username, password).subscribe((data) => {
      this.commService.currentUser = {username, accessToken : data['accessToken'], recentRooms : []};
      localStorage.setItem('username', this.commService.currentUser.username);
      localStorage.setItem('accessToken', this.commService.currentUser.accessToken);
      this.commService.initiateUser();
      this.loading = false;
      this.router.navigate(['/', 'profile']);
    }, (error) => {
      console.log(error);
      this.loading = false;
      this.messages = [
        { severity: 'error', summary: 'Error', detail: error.error.message },
      ]
    });
    this.loginForm.reset();
  }
}
