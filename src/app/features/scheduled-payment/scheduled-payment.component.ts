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
import { ScpiIndexModel } from "@/core/model/scpi.model";
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

  investedByYear: Record<string, number> = {};
  estimatedRevenueByYear: Record<string, number> = {};

  selectedScpi: ScpiIndexModel | null = null;
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

  private get sharePrice(): number {
    return this.selectedScpi?.sharePrice || 0;
  }

  createInvestment(): void {
    if (this.investment.scpiId) {
      const totalAmount = this.investment.numberShares * this.sharePrice;

      this.investorService
        .createInvestment({ ...this.investment, totalAmount })
        .subscribe({
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

  updateSelectedScpi(value: ScpiIndexModel) {
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

    const sharePrice = this.selectedScpi?.sharePrice || 0;
    const distributionRate = (this.selectedScpi?.distributionRate || 0) / 100;
    const initialDepositAmount = this.investment.initialDeposit * sharePrice;
    const yearlyInvestment = sharePrice * this.investment.numberShares * 12;
    const growthRate = Number(this.customGrowthRate) || 0;

    const investedData: number[] = [initialDepositAmount];
    const estimatedRevenueData: number[] = [0];

    let totalInvested = initialDepositAmount;
    let totalEstimatedRevenue = 0;

    for (let year = 1; year <= this.MAX_YEARS; year++) {
      const growthFactor = growthRate ? 1 + growthRate / 100 : 1;
      totalInvested = totalInvested * growthFactor + yearlyInvestment;

      const lastYearInvestedData = investedData[year - 1];
      totalEstimatedRevenue +=
        lastYearInvestedData *
        (distributionRate + (growthRate ? growthRate / 100 : 0));

      investedData.push(Math.round(totalInvested));
      estimatedRevenueData.push(Math.round(totalEstimatedRevenue));

      if (this.LABEL_YEARS.includes(year)) {
        this.investedByYear[year] = Math.round(totalInvested);
        this.estimatedRevenueByYear[year] = Math.round(totalEstimatedRevenue);
      }
    }

    this.chartData = {
      labels: simulationYears.map((y) => `${y} an${y > 1 ? "s" : ""}`),
      datasets: [
        {
          label: "Total investi",
          data: investedData,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
        },
        {
          label: "Revenus estimés",
          data: estimatedRevenueData,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
        },
      ],
    };
  }
}
