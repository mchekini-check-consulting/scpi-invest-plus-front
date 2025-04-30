import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter((isDone) => isDone),
      switchMap((_) => this.authService.isAuthenticated$),
      tap((isAuthenticated) => isAuthenticated || this.authService.login())
    );
  }
}
