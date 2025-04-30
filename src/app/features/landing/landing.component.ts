import { Component } from "@angular/core";
import { AuthService } from "@/core/service/auth.service";
import { CardModule } from "primeng/card";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing",
  imports: [CardModule],
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.css",
})
export class LandingComponent {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  login() {
    if (this.isAuthenticated) {
      this.router.navigate(["/dashboard"]);
      return;
    }
    this.authService.login();
  }
}
