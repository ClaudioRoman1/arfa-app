import { Component } from '@angular/core';
import { Auth } from 'src/core/services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private authService :Auth) {
  }

    get currentUser() : string | null {
      return this.authService.getCurrentUser();
    }
}
