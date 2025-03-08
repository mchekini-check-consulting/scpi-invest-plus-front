import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {PlanModel} from '@/core/model/plan.model';
import {UserService} from '@/core/service/user.service';
import {PlanService} from '@/core/service/plan.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  key: string;
  feature: string;
}

export const ROUTES: RouteInfo[] = [
  {path: '/scpi', title: 'Liste des SCPI ', key: 'SIDEBAR.SCPI', icon: 'nc-icon nc-ruler-pencil', class: '', feature:'list-scpi' },
  {path: '/simulations', title: 'Mes simulations',key : 'SIDEBAR.SIMULATION', icon: 'nc-icon nc-layers-3', class: '', feature:'simulation'},
  {path: '/portefeuille', title: 'Portefeuille',key : 'SIDEBAR.PORTEFEUILLE', icon: 'nc-icon nc-money-coins', class: '', feature:'portefeuille'},
  {path: '/comparateur', title: 'Comparateur SCPI',key : 'SIDEBAR.COMPARATEUR', icon: 'nc-icon nc-layers-3', class: '',feature:'comparateur'},

];

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf,
    TranslateModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  menuItems: RouteInfo[] = [];
  version = "2.0.0";
  plans: PlanModel [] = [];

  constructor(private userService: UserService, private planService : PlanService) {

    this.userService.user$.subscribe(user => {
      if (user != null)
      this.planService.getPlans().subscribe(plans => {
        this.plans = plans;
      })
    });
  }


  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  DisplayFeatureForConnectedUser(functionality: string): boolean {
    const userRole = this.userService.getUser()?.role;
    if (userRole === 'Standard')
      return this.plans.some(feature => feature.functionality === functionality && feature.standard);
    if (userRole === 'Premium')
      return this.plans.some(feature => feature.functionality === functionality && feature.premium);
    return false;
  }

}
