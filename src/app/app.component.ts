import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OAuthErrorEvent, OAuthEvent, OAuthService, OAuthSuccessEvent} from 'angular-oauth2-oidc';
import {UserService} from './core/service/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private oauthService: OAuthService, private userService: UserService) {

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthSuccessEvent) {
        if (event.type === 'token_received' || event.type === 'token_refreshed') {
          this.userService.loadUser();
        }
      } else if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent:', event);
      }
    });
  }
}
