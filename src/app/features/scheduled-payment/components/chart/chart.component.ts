import { Component, Input } from "@angular/core";
import { Card } from "primeng/card";
import { UIChart } from "primeng/chart";
import { Chart, ChartData, ChartOptions, Plugin } from "chart.js";

@Component({
  selector: "app-chart",
  standalone: true,
  imports: [Card, UIChart],
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.css",
})
export class ChartComponent {
  @Input() data!: ChartData;

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      axis: "x",
      intersect: false,
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        enabled: true,
        callbacks: {
          title: (tooltipItems: any) => {
            return `Épargne totale après ${tooltipItems[0].label}`;
          },
          label: (tooltipItem: any) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()} €`;
          },
        },
      },
    },
  };

  verticalHoverLine: Plugin = {
    id: "verticalHoverLine",
    beforeDatasetsDraw: (chart) => {
      const {
        ctx,
        chartArea: { top, bottom, height },
      } = chart;

      ctx.save();

      chart.getDatasetMeta(0).data.forEach((dataPoint, index) => {
        if (dataPoint.active) {
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.moveTo(dataPoint.x, top);
          ctx.lineTo(dataPoint.x, bottom);
          ctx.stroke();
        }
      });
    },
  };

  constructor() {
    Chart.register(this.verticalHoverLine);
  }
}
