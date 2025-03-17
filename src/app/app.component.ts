import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OAuthErrorEvent, OAuthEvent, OAuthService, OAuthSuccessEvent} from 'angular-oauth2-oidc';
import {UserService} from './core/service/user.service';
import { ScpiService } from '@/core/service/scpi.service';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private oauthService: OAuthService, private userService: UserService, private scpiService: ScpiService) {

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthSuccessEvent) {
        if (event.type === 'token_received' || event.type === 'token_refreshed') {
          this.userService.loadUser();

        }

      } else if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent:', event);
      }
    });

    this.userService.user$.pipe(
      filter(user => !!user),
      take(1),
      switchMap(() => this.scpiService.get())
    ).subscribe();
  }
}
