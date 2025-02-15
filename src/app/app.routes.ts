import {Routes} from '@angular/router';
import {TemplateComponent} from './core/template/container/template.component';
import {ScpiComponent} from './features/scpi/scpi.component';
import { DetailsDetialsComponent } from './features/scpi/details-detials/details-detials.component';
import { DetailsComponent } from './features/scpi/details/details.component';
import { DetailsGlobalViewComponent } from './features/scpi/details-global-view/details-global-view.component';
import {AuthGuard} from './core/guard/auth.guard';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'scpi', component: ScpiComponent, children: [

        ]
      },
      {
        path: "details",
        component: DetailsComponent,
        children: [
          {
            path: "show",
            component: DetailsDetialsComponent,
          },
          {
            path: "global",
            component: DetailsGlobalViewComponent
          }
        ]
      }
    ],
  }
];
