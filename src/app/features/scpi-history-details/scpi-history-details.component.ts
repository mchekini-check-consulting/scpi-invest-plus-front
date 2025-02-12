import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-scpi-history-details',
  templateUrl: './scpi-history-details.component.html',
  styleUrls: ['./scpi-history-details.component.css'],
  imports: [ChartModule /* autres imports */],
})
export class ScpiHistoryDetailsComponent implements OnInit {
  distributionChartData: any;
  priceChartData: any;
  chartOptions: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: '' } },
        y: { title: { display: true, text: '' } },
      },
    };

    this.distributionChartData = {
      labels: ['2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Taux de distribution (%)',
          data: [4.5, 2.8, 4.2, 4.6, 4.9],
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
        },
      ],
    };

    this.priceChartData = {
      labels: ['2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Prix de la part (€)',
          data: [100, 105, 12, 110, 55],
          borderColor: '#FFA726',
          backgroundColor: 'rgba(255, 167, 38, 0.2)',
          fill: true,
        },
      ],
    };
  }
}
