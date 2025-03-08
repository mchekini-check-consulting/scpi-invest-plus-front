import { Injectable } from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../config/auth.config';
import {filter} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedOut = false;

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.configure(authCodeFlowConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initLoginFlow();
      } else {
        this.setupRefreshToken();
      }
    });

    this.oauthService.events.pipe(
      filter(event => event.type === 'token_expires')
    ).subscribe(() => {
      console.log('Token expiré, tentative de refresh...');
      this.oauthService.refreshToken()
        .then(() => console.log('Token rafraîchi avec succès'))
        .catch(err => {
          console.error('Échec du refresh token', err);
          this.oauthService.initLoginFlow();
        });
    });
  }

  private setupRefreshToken() {
    setInterval(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.oauthService.refreshToken()
          .then(() => console.log('Token rafraîchi automatiquement'))
          .catch(err => console.error('Erreur lors du refresh token', err));
      }
    }, 1200000);
  }


  logout() {
    this.isLoggedOut = true;
    this.oauthService.logOut();
    // @ts-ignore
    this.oauthService.clearHashAfterLogin();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
