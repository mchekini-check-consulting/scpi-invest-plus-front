import {Routes} from '@angular/router';
import {TemplateComponent} from './core/template/container/template.component';
import {ScpiComponent} from './features/scpi/scpi.component';
import {DetailsDetialsComponent} from './features/scpi/details-detials/details-detials.component';
import {DetailsComponent} from './features/scpi/details/details.component';
import {DetailsGlobalViewComponent} from './features/scpi/details-global-view/details-global-view.component';
import {AuthGuard} from './core/guard/auth.guard';
import {ProfileComponent} from './features/profile/components/profile.component';
import {ScpiHistoryDetailsComponent} from './features/scpi/details-history/scpi-history-details.component';
import {SimulationComponent} from './features/simulation/container/simulation.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: 'scpi',
        component: ScpiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'simulations',
        component: SimulationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'details/:id',
        component: DetailsComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'show',
            component: DetailsDetialsComponent,
          },
          {
            path: 'global',
            component: DetailsGlobalViewComponent,
          },
          {
            path: 'history',
            component: ScpiHistoryDetailsComponent,
          },
        ],
      },
    ],
  },]
