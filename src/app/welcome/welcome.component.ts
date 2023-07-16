import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  messages : Message[]
  
  constructor(private activatedRoute : ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next : (params) => {
        if (params['serverOffline'] === "true") {
          this.messages = [
            {severity : 'error', summary : 'Uh Oh!', detail : 'Due to resource limitations, the server is temporarily down, and will be online in a few seconds. Kindly reload the page.'},
          ]
        }
      }
    })
  }
}
