import { Component, Input } from "@angular/core";
import { UIChart } from "primeng/chart";
import { Chart, ChartData, ChartOptions, Plugin } from "chart.js";
import { Panel } from "primeng/panel";
import { PrimeTemplate } from "primeng/api";

@Component({
  selector: "app-chart",
  standalone: true,
  imports: [UIChart, Panel, PrimeTemplate],
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.css",
})
export class ChartComponent {
  @Input() data!: ChartData;

  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          callback: function (_, index) {
            const showYears = [5, 10, 20, 30];
            return showYears.includes(index)
              ? `${index} an${index > 1 ? "s" : ""}`
              : "";
          },
        },
      },
    },
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

  crossLine: Plugin = {
    id: "crossLine",
    beforeDatasetsDraw(chart, args, plugins) {
      const {
        data,
        ctx,
        scales: { x, y },
        chartArea: { bottom },
      } = chart;

      ctx.save();

      data.datasets[0].data.forEach((datapoint, index) => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.moveTo(
          x.getPixelForValue(index),
          chart.getDatasetMeta(0).data[index].y
        );
        ctx.lineTo(x.getPixelForValue(index), bottom);
        ctx.stroke();
      });

      ctx.restore();
    },
  };

  constructor() {
    Chart.register(this.verticalHoverLine);
    // Chart.register(this.crossLine);
  }
}
