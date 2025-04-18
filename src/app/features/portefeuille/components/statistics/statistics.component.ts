import { Component, Input } from "@angular/core";
import { InvestmentStatistics } from "@/core/model/Investments";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-statistics",
  imports: [CardModule, CommonModule],
  templateUrl: "./statistics.component.html",
  styleUrl: "./statistics.component.css",
})
export class StatisticsComponent {
  @Input() statistics?: InvestmentStatistics;
}
