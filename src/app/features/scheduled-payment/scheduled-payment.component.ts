import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { SliderModule } from "primeng/slider";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputNumberModule } from "primeng/inputnumber";
import { ChartComponent } from "@/features/scheduled-payment/components/chart/chart.component";
import { SlidersComponent } from "@/features/scheduled-payment/components/sliders/sliders.component";
import { SelectScpiComponent } from "@/features/scheduled-payment/components/select-scpi/select-scpi.component";
import { InvestmentPayload } from "@/core/model/Investments";

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
    FormsModule,
    SelectButton,
    ChartComponent,
    SlidersComponent,
    SelectScpiComponent,
  ],
  templateUrl: "./scheduled-payment.component.html",
  styleUrl: "./scheduled-payment.component.css",
})
export class ScheduledPaymentComponent {
  investment: InvestmentPayload = {
    numberShares: 1,
    totalAmount: 0,
    scpiId: 0,
    status: "SCHEDULED",
    typeProperty: "Pleine propriété",
    investmentState: "Investissement",
  };

  stateOptions = [
    { label: "5 ans", value: "5 ans" },
    { label: "10 ans", value: "10 ans" },
    { label: "20 ans", value: "20 ans" },
    { label: "30 ans", value: "30 ans" },
  ];
  value: string = "5 ans";

  monthlyIncome: number = 85;

  totalValue: number = 13650;
  totalRevenue: number = 2253;

  chartData: any;

  constructor() {
    this.initChart();
  }

  updateInvestmentState(payload: Partial<InvestmentPayload>) {
    this.investment = { ...this.investment, ...payload };
  }

  initChart() {
    this.chartData = {
      labels: ["1 an", "5 ans", "10 ans", "20 ans", "30 ans"],
      datasets: [
        {
          label: "Valeur totale",
          data: [1000, 13650, 30000, 60000, 120000],
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
        },
        {
          label: "Revenus cumulés",
          data: [100, 2253, 6000, 20000, 50000],
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
        },
      ],
    };
  }
}
