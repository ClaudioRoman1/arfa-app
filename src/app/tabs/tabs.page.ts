import { Component } from '@angular/core';
import { Auth } from 'src/core/services/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private authService : Auth) {}

  logout(){
    this.authService.logout();
  }


}
