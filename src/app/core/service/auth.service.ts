import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { BehaviorSubject } from "rxjs";
import { authCodeFlowConfig } from "../config/auth.config";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authInitializedSubject = new BehaviorSubject<boolean>(false);
  public authInitialized$ = this.authInitializedSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private userService: UserService
  ) {
    this.configureOAuth();
  }

  private async configureOAuth() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.oauthService.hasValidAccessToken()) {
      this.userService.loadUser();
    }
    
    this.authInitializedSubject.next(true);
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    // @ts-ignore
    this.oauthService.clearHashAfterLogin();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
