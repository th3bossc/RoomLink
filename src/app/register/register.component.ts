import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { CommunicationService } from '../Services/communication.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading : boolean;
  registerForm : FormGroup;
  messages : Message[];
  constructor(private commService : CommunicationService, private router : Router) {}

  ngOnInit() {
    this.loading = false;
    this.registerForm = new FormGroup({
      username : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      password : new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword : new FormControl(null, [Validators.required, Validators.minLength(8)]),
    })
  }

  onSubmit() {
    this.loading = true;
    const {username, password, confirmPassword} = this.registerForm.value;

    if (password !== confirmPassword) {
      this.messages = [
        { severity : 'warn', summary : 'Warning', detail : "Password fields don't match"},
      ];
      this.loading = false;
      return;
    }

    this.commService.registerUser(username, password).subscribe({
      next : data => {
        this.loading = false;
        this.router.navigate(['/', 'home', 'login'], {queryParams : {newUser : true}});
      },
      error : error => {
        this.messages = [
          { severity: 'error', summary: 'Error', detail: error.error.message },
        ];
        this.loading = false;
      }
    });

    this.registerForm.reset();
  }
}
