import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
import {UserModel} from "../model/user.model";
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<UserModel | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private oauthService: OAuthService, private router: Router) {
    this.loadUser();
  }

  public loadUser() {
    const identityClaims = this.oauthService.getIdentityClaims();
    const accessToken = this.oauthService.getAccessToken();
    let userRole = 'Standard';

    if (accessToken) {
      try {
        const payload: any = jwtDecode(accessToken);
        userRole = payload?.resource_access?.['scpi-invest-plus']?.roles[0] || 'Standard';
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
      console.log(this.router.url, new Date().getMinutes(), new Date().getSeconds()); // ✅ Ensures the correct URL is logged
      if (this.router.url === '/') {
        this.router.navigate(['/scpi']);
      }
    }
  }


  public getUser(): UserModel | null {
    return this.userSubject.value;
  }
}
