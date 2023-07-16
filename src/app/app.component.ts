import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'
import { CommunicationService } from './Services/communication.service';
import { Router, RouterOutlet } from '@angular/router';
import { Message } from 'primeng/api';
import { slider, stepper } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations : [stepper]
})
export class AppComponent {
  title = 'ChatApp';
  constructor (private config : PrimeNGConfig, private commService : CommunicationService, private router : Router) {}

  ngOnInit() {
    this.config.ripple = true;
    
    this.commService.tryLogin().subscribe({
      next : data => {
        this.commService.importUser();
        this.commService.initiateUser();
        this.router.navigate(['/', 'profile'])
      },
      error : error => this.router.navigate(['/', 'home', 'welcome'], {queryParams : {serverOffline : error.status !== 401}}),
    });
    
  }

  prepareRoute(outlet : RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
