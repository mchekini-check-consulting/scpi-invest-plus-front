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
    this.planService.plans$.subscribe((plans) => {
      this.plans = plans;
    });
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) return false;

    const requestedPath = state.url;
    const routeConfig = ROUTES.find((route) => route.path === requestedPath);

    if (!routeConfig) {
      return true;
    }

    const functionality = routeConfig.feature;

    const hasAccess =
      (this.user?.role === "Standard" &&
        this.plans.some(
          (p) => p.functionality === functionality && p.standard
        )) ||
      (this.user?.role === "Premium" &&
        this.plans.some((p) => p.functionality === functionality && p.premium));

    if (hasAccess) {
      return true;
    }

    return this.router.createUrlTree(["/unauthorized"]);
  }
}
