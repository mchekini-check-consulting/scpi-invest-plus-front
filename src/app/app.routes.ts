import {Routes} from '@angular/router';
import {TemplateComponent} from './core/template/container/template.component';
import {ScpiComponent} from './features/scpi/scpi.component';
import { ProfileComponent } from './features/profile/components/profile.component';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent, children: [
      {
        path: 'scpi', component: ScpiComponent
      },
      {
        path: 'profile', component: ProfileComponent
      }
    ],
  }


];
