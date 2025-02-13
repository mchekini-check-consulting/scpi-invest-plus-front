import {Routes} from '@angular/router';
import {TemplateComponent} from './core/template/container/template.component';
import {ScpiComponent} from './features/scpi/scpi.component';
import {AuthGuard} from './core/guard/auth.guard';

export const routes: Routes = [

  {
    path: '', component: TemplateComponent,
    children: [
      {
        path: 'scpi', component: ScpiComponent, canActivate: [AuthGuard],
      }
    ],
  }
];
