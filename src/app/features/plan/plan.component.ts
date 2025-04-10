import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserService} from "@/core/service/user.service";
import {AuthService} from "@/core/service/auth.service";
import {DialogModule} from "primeng/dialog";
import {PlanService} from '@/core/service/plan.service';
import {PlanModel} from '@/core/model/plan.model';

@Component({
  selector: 'app-premium-plan',
  standalone: true,
  imports: [
    TableModule,
    NgIf,
    NgForOf,
    NgClass,
    DialogModule
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent implements OnInit {

  constructor(private planService: PlanService,private user:UserService,
              private authService: AuthService) {}

  functionality!: PlanModel [];
  isPremium: boolean = false;
  showConfirmationPopup: boolean = false;
  countdown: number = 5;

  subscribe() {

    this.showConfirmationPopup = true;
    this.startCountdown();
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(interval);
        this.authService.logout();
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.planService.getPlans().subscribe(data => {
      this.functionality = data;
    })

    this.isPremium = this.user.getUser()?.role === "Premium";
  }

  onChangePlan(currentPlan: String, newPlan: string) {
    this.planService.sendPlan(currentPlan, newPlan).subscribe(data => {
      this.subscribe();
    });
  }

}
