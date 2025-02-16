import { Details } from '@/core/model/Details';
import { StatYear } from '@/core/model/StatYear';
import { DetailsDetailsService } from '@/core/service/details-details.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scpi-history-details',
  templateUrl: './scpi-history-details.component.html',
  styleUrls: ['./scpi-history-details.component.css'],
  imports: [ChartModule, CommonModule],
})
export class ScpiHistoryDetailsComponent implements OnInit {
  @Input() id_parent: number = 0;
  details: Details | null = null;
  stat: StatYear[] | null = [];
  years: number[] = [];
  distributionRates: number[] = [];
  sharePrices: number[] = [];

  detailsService = inject(DetailsDetailsService);

  distributionChartData: any;
  priceChartData: any;
  chartOptions: any;

  ngOnInit() {
    this.getTheDetails(this.id_parent);
  }

  getTheDetails(id: number) {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe({
      next: (res) => {
        if (res) {
          this.details = res;
          this.stat = this.details.statYears;
          this.years = this.stat
            .map((stat) => stat.yearStat.yearStat as number)
            .sort((a, b) => a - b);
          this.distributionRates = this.stat?.map(
            (stat) => stat.distributionRate
          );
          this.sharePrices = this.stat?.map((stat) => stat.sharePrice);
          this.initCharts();
        } else {
          alert('Received undefined details.');
        }
      },
      error: (err) => console.error('Error fetching details:', err),
    });
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
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
    };

    this.distributionChartData = {
      labels: this.years,
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
      labels: this.years,
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
