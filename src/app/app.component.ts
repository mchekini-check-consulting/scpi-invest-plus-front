import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { UserService } from "./core/service/user.service";
import { PlanService } from "@/core/service/plan.service";
import { AuthService } from "./core/service/auth.service";
import { filter, switchMap } from "rxjs/operators";
import { Toast } from "primeng/toast";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Toast],
  templateUrl: "./app.component.html",
  standalone: true,
  styleUrl: "./app.component.css",
})
export class AppComponent {
  constructor(
    private userService: UserService,
    private planService: PlanService,
    private authService: AuthService
  ) {
    this.authService.authInitialized$
      .pipe(
        filter((initialized) => initialized),
        switchMap(() => this.userService.user$),
        filter((user) => !!user),
        switchMap(() => this.planService.getPlans())
      )
      .subscribe();
  }
}
