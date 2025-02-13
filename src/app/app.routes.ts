import {Routes} from '@angular/router';
import {TemplateComponent} from './core/template/container/template.component';
import {ScpiComponent} from './features/scpi/scpi.component';
import { DetailsDetialsComponent } from './features/details-detials/details-detials.component';
import { DetailsComponent } from './features/details/details.component';
import { DetailsGlobalViewComponent } from './features/details-global-view/details-global-view.component';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'scpi', component: ScpiComponent
      },
      {
        path:"index",
        component: DetailsComponent,
        children:[
          {
            path: "details",
          component: DetailsDetialsComponent,
          }, 
          {
            path: "history",
            component: DetailsGlobalViewComponent
          }
        ]
      }
    
    ],
    
  },
 

];
