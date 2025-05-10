import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable({
  providedIn: "root",
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.oauthService.hasValidIdToken()) {
      return true;
    }
    return this.router.createUrlTree(["/"]);
  }
}
