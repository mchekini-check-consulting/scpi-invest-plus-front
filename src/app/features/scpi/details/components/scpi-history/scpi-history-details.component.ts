import { Details } from '@/core/model/Details';
import { StatYear } from '@/core/model/StatYear';
import { DetailsDetailsService } from '@/core/service/details-details.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '@/shared/component/chart/chart.component';


@Component({
  selector: 'app-scpi-history-details',
  templateUrl: './scpi-history-details.component.html',
  styleUrls: ['./scpi-history-details.component.css'],
  imports: [ChartModule, CommonModule,ChartComponent],
})
export class ScpiHistoryDetailsComponent implements OnInit {
  @Input() id_parent: number = 0;
  @Input() details: Details | null = null;
  stat: StatYear[] | null = [];
  years: number[] = [];
  distributionRates: number[] = [];
  sharePrices: number[] = [];

  detailsService = inject(DetailsDetailsService);

  yearsDistribution: number[] = [];
  yearsSharePrice: number[] = [];

  distributionChartData: any;
  priceChartData: any;
  chartOptions: any;

  ngOnInit() {
    this.getTheDetails(this.id_parent);
  }

  getTheDetails(id: number) {

          if(!this.details) return;
          this.stat = this.details.statYears;

          const distributionStats = this.stat.filter(
            (stat) =>
              stat.distributionRate !== null && stat.distributionRate !== 0
          );

          const sortedDistributionStats = distributionStats.sort(
            (a, b) => a.yearStat.yearStat - b.yearStat.yearStat
          );
          this.yearsDistribution = sortedDistributionStats.map(
            (stat) => stat.yearStat.yearStat
          );
          this.distributionRates = sortedDistributionStats.map((stat) =>
            Number(stat.distributionRate)
          );

          const priceStats = this.stat.filter(
            (stat) => stat.sharePrice !== null && stat.sharePrice !== 0
          );

          const sortedPriceStats = priceStats.sort(
            (a, b) => a.yearStat.yearStat - b.yearStat.yearStat
          );
          this.yearsSharePrice = sortedPriceStats.map(
            (stat) => stat.yearStat.yearStat
          );
          this.sharePrices = sortedPriceStats.map((stat) =>
            Number(stat.sharePrice)
          );

          this.initCharts();

  }

  initCharts() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true, mode: 'index', intersect: false },
      },
      scales: {
        x: {
          title: { display: true, text: '', color: '#666' },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: '', color: '#666' },
          grid: { color: '#eee' },
          min: 0,
          ticks: {
            beginAtZero: true,
          },
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
    };
    this.distributionChartData = {
      labels: this.yearsDistribution,
      datasets: [
        {
          label: 'Taux de distribution (%)',
          data: this.distributionRates,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
        },
      ],
    };
    this.priceChartData = {
      labels: this.yearsSharePrice,
      datasets: [
        {
          label: 'Prix de la part (€)',
          data: this.sharePrices,
          borderColor: '#FFA726',
          backgroundColor: 'rgba(255, 167, 38, 0.2)',
          fill: true,
        },
      ],
    };
  }
}
