import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  constructor(private oauthService: OAuthService) {
    this.oauthService.events.subscribe((_) => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });
    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

    this.oauthService.events
      .pipe(filter((e) => ["token_received"].includes(e.type)))
      .subscribe((e) => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(
        filter((e) => ["session_terminated", "session_error"].includes(e.type))
      )
      .subscribe((e) => this.oauthService.initLoginFlow());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public async runInitialLoginSequence(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.isDoneLoadingSubject$.next(true);
    } catch {
      return this.isDoneLoadingSubject$.next(true);
    }
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }
}
