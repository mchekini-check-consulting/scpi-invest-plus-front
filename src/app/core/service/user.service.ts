import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {UserModel} from "../model/user.model";
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<UserModel | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private oauthService: OAuthService) {
    this.loadUser();
  }

  public loadUser() {
    const identityClaims = this.oauthService.getIdentityClaims();
    const accessToken = this.oauthService.getAccessToken();
    let userRole = 'Standard';

    if (accessToken) {
      try {
        const payload: any = jwtDecode(accessToken);
        userRole = payload?.realm_access?.roles.includes("Premium") ? "Premium" : "Standard";
      } catch (error) {
        console.error("Erreur de décodage de l'Access Token", error);
      }
    }

    if (identityClaims) {
      this.userSubject.next({
        userName: identityClaims['preferred_username'],
        lastName: identityClaims['family_name'],
        firstName: identityClaims['given_name'],
        email: identityClaims['email'],
        role: userRole
      });
      console.log("Le rôle récupéré est :", userRole);
    }
  }


  public getUser(): UserModel | null {
    return this.userSubject.value;
  }
}
