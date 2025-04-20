import { Component, OnInit } from "@angular/core";
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PlanModel } from "@/core/model/plan.model";
import { UserService } from "@/core/service/user.service";
import { PlanService } from "@/core/service/plan.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  key: string;
  feature: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/scpi",
    title: "Liste des SCPI",
    key: "SIDEBAR.SCPI",
    icon: "pi pi-building-columns",
    class: "",
    feature: "list-scpi",
  },
  {
    path: "/portefeuille",
    title: "Portefeuille",
    key: "SIDEBAR.PORTEFEUILLE",
    icon: "pi pi-wallet",
    class: "",
    feature: "portefeuille",
  },
  {
    path: "/scheduled-payment",
    title: "Versements programmés",
    key: "SIDEBAR.VERSEMENT",
    icon: "pi pi-calendar-clock",
    class: "",
    feature: "scheduled-payment",
  },
  {
    path: "/simulations",
    title: "Mes simulations",
    key: "SIDEBAR.SIMULATION",
    icon: "pi pi-chart-line",
    class: "",
    feature: "simulation",
  },
  {
    path: "/comparateur",
    title: "Comparateur SCPI",
    key: "SIDEBAR.COMPARATEUR",
    icon: "pi pi-chart-bar",
    class: "",
    feature: "comparateur",
  },
  {
    path: "/credit",
    title: "Crédit",
    key: "SIDEBAR.CREDIT",
    icon: "pi pi-credit-card",
    class: "",
    feature: "credit",
  },
  {
    path: "/profile",
    title: "Mes informations",
    key: "SIDEBAR.MY-PROFILE",
    icon: "pi pi-user",
    class: "",
    feature: "profile",
  },
  {
    path: "/plans",
    title: "Gestion des plans",
    key: "SIDEBAR.PLANS",
    icon: "pi pi-sitemap",
    class: "",
    feature: "plans",
  },
];

@Component({
  selector: "app-sidebar",
  imports: [NgForOf, TranslateModule, RouterLink, NgIf],
  templateUrl: "./sidebar.component.html",
  standalone: true,
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  version = "1.0.0";
  menuItems: RouteInfo[] = [];
  plans: PlanModel[] = [];

  constructor(
    private userService: UserService,
    private planService: PlanService
  ) {
    this.userService.user$.subscribe((user) => {
      if (user != null)
        this.planService.getPlans().subscribe((plans) => {
          this.plans = plans;
        });
    });
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  DisplayFeatureForConnectedUser(functionality: string): boolean {
    const userRole = this.userService.getUser()?.role;
    if (userRole === "Standard")
      return this.plans.some(
        (feature) => feature.functionality === functionality && feature.standard
      );
    if (userRole === "Premium")
      return this.plans.some(
        (feature) => feature.functionality === functionality && feature.premium
      );
    return false;
  }
}
