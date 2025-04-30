import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../service/auth.service";
import { UserService } from "@/core/service/user.service";
import { PlanService } from "@/core/service/plan.service";
import { PlanModel } from "@/core/model/plan.model";
import { UserModel } from "@/core/model/user.model";
import { ROUTES } from "@/core/template/components/sidebar/sidebar.component";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  plans: PlanModel[] = [];
  user: UserModel | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private planService: PlanService,
    private router: Router
  ) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isAuthenticated$) return false;

    const requestedPath = state.url;
    const routeConfig = ROUTES.find((route) => route.path === requestedPath);

    if (!routeConfig) {
      return true;
    }

    const functionality = routeConfig.feature;

    return this.planService.plans$.pipe(
      map((plans) => {
        const hasAccess =
          (this.user?.role === "Standard" &&
            plans.some(
              (p) => p.functionality === functionality && p.standard
            )) ||
          (this.user?.role === "Premium" &&
            plans.some((p) => p.functionality === functionality && p.premium));
        return hasAccess ? true : this.router.createUrlTree(["/unauthorized"]);
      })
    );
  }
}
