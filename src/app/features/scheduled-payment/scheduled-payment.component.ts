import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { SliderModule } from "primeng/slider";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { Panel } from "primeng/panel";
import { DecimalPipe } from "@angular/common";

import { ChartComponent } from "@/features/scheduled-payment/components/chart/chart.component";
import { SelectScpiComponent } from "@/features/scheduled-payment/components/select-scpi/select-scpi.component";
import { InvestmentPayload } from "@/core/model/Investments";
import { ScpiModel } from "@/core/model/scpi.model";
import { InvestorService } from "@/core/service/investor.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-scheduled-payment",
  imports: [
    FormsModule,
    SliderModule,
    CardModule,
    ButtonModule,
    ChartModule,
    ToggleButtonModule,
    InputNumberModule,
    SelectButton,
    ChartComponent,
    SelectScpiComponent,
    DropdownModule,
    DecimalPipe,
    Panel,
  ],
  templateUrl: "./scheduled-payment.component.html",
  styleUrl: "./scheduled-payment.component.css",
})
export class ScheduledPaymentComponent {
  private readonly LABEL_YEARS = [5, 10, 20, 30];
  private readonly MAX_YEARS = 30;

  totalValue: Record<string, number> = {};
  revenueValue: Record<string, number> = {};

  selectedScpi: ScpiModel | null = null;
  customGrowthRate: number = 0;

  investment: InvestmentPayload = {
    numberShares: 1,
    totalAmount: 0,
    scpiId: 0,
    status: "SCHEDULED",
    typeProperty: "Pleine propriété",
    investmentState: "Investissement",
    initialDeposit: 0,
  };

  yearOptions = this.LABEL_YEARS.map((y) => ({
    label: `${y} ans`,
    value: y.toString(),
  }));
  yearValue = "5";

  chartData: any = null;

  constructor(
    private investorService: InvestorService,
    private messageService: MessageService
  ) {
    this.updateChart();
  }

  createInvestment(): void {
    if (this.investment.scpiId) {
      this.investorService.createInvestment(this.investment).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Demande en cours",
            detail:
              "Votre demande d'investissement est en cours de traitement. Une décision vous sera envoyée par email dans les plus brefs délais.",
            life: 2000,
          });
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Une erreur est survenue lors de l'investissement.",
          });
        },
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez compléter tous les champs obligatoires.",
      });
    }
  }

  updateSelectedScpi(value: ScpiModel) {
    this.selectedScpi = value;
    this.updateChart();
  }

  updateInvestmentState(payload: Partial<InvestmentPayload>) {
    this.investment = { ...this.investment, ...payload };
    this.updateChart();
  }

  updateChart(): void {
    if (this.customGrowthRate < -10) this.customGrowthRate = -10;
    if (this.customGrowthRate > 10) this.customGrowthRate = 10;

    const simulationYears = Array.from(
      { length: this.MAX_YEARS + 1 },
      (_, i) => i
    );

    const sharePrice = this.selectedScpi?.statYear?.sharePrice || 0;
    const distributionRate =
      (this.selectedScpi?.statYear?.distributionRate || 0) / 100;
    const initialDepositAmount = this.investment.initialDeposit * sharePrice;
    const yearlyInvestment = sharePrice * this.investment.numberShares * 12;
    const growthRate = Number(this.customGrowthRate) || 0;

    const valueData: number[] = [initialDepositAmount];
    const revenueData: number[] = [0];

    let cumulativeRevenue = 0;
    let totalValue = initialDepositAmount;

    for (let year = 1; year <= this.MAX_YEARS; year++) {
      const growthFactor = growthRate ? 1 + growthRate / 100 : 1;
      totalValue = totalValue * growthFactor + yearlyInvestment;

      const revenueBase = valueData[year - 1];
      cumulativeRevenue +=
        revenueBase * (distributionRate + (growthRate ? growthRate / 100 : 0));

      valueData.push(Math.round(totalValue));
      revenueData.push(Math.round(cumulativeRevenue));

      if (this.LABEL_YEARS.includes(year)) {
        this.totalValue[year] = Math.round(totalValue);
        this.revenueValue[year] = Math.round(cumulativeRevenue);
      }
    }

    this.chartData = {
      labels: simulationYears.map((y) => `${y} an${y > 1 ? "s" : ""}`),
      datasets: [
        {
          label: "Valeur totale",
          data: valueData,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
        },
        {
          label: "Revenus cumulés",
          data: revenueData,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
        },
      ],
    };
  }
}
