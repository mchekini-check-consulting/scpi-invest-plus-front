import { Routes } from "@angular/router";
import { TemplateComponent } from "@/core/template/container/template.component";
import { ScpiComponent } from "@/features/scpi/scpi.component";
import { DetailsDetialsComponent } from "@/features/scpi/details/components/scpi-details/details-detials.component";
import { DetailsComponent } from "@/features/scpi/details/container/details.component";
import { DetailsGlobalViewComponent } from "@/features/scpi/details/components/scpi-global-view/details-global-view.component";
import { PortefeuilleComponent } from "@/features/portefeuille/components/portefeuille.component";
import { AuthGuard } from "@/core/guard/auth.guard";
import { ProfileComponent } from "@/features/profile/components/profile.component";
import { ScpiHistoryDetailsComponent } from "@/features/scpi/details/components/scpi-history/scpi-history-details.component";
import { SimulationComponent } from "@/features/simulation/container/simulation.component";
import { ComparatorComponent } from "@/features/comparator/comparator.component";
import { CreditComponent } from "@/features/credit/credit.component";
import { PlanComponent } from "@/features/plan/plan.component";
import { ScheduledPaymentComponent } from "@/features/scheduled-payment/scheduled-payment.component";
import { NotFoundComponent } from "@/features/not-found/not-found.component";
import { SimulationDetailComponent } from "./features/simulation/components/simulation-detail/simulation-detail.component";

export const routes: Routes = [
  {
    path: "",
    component: TemplateComponent,
    children: [
      {
        path: "",
        component: ScpiComponent,
      },
      {
        path: "scpi",
        component: ScpiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "credit",
        component: CreditComponent,
      },
      {
        path: "plans",
        component: PlanComponent,
      },
      {
        path: "simulations",
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            component: SimulationComponent,
          },
          {
            path: "details/:id",
            component: SimulationDetailComponent,
          },
          {
            path: "detailSimulation",
            component: SimulationDetailComponent,
          },
        ],
      },
      {
        path: "comparateur",
        component: ComparatorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "details/:id",
        component: DetailsComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "show",
            component: DetailsDetialsComponent,
          },
          {
            path: "global",
            component: DetailsGlobalViewComponent,
          },
          {
            path: "history",
            component: ScpiHistoryDetailsComponent,
          },
        ],
      },
      {
        path: "portefeuille",
        component: PortefeuilleComponent,
      },
      {
        path: "scheduled-payment",
        component: ScheduledPaymentComponent,
      },
    ],
  },
  { path: "**", component: NotFoundComponent },
];
