import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-scpi-history-details',
  templateUrl: './scpi-history-details.component.html',
  styleUrls: ['./scpi-history-details.component.css'],
  imports: [ChartModule],
})
export class ScpiHistoryDetailsComponent implements OnInit {
  // Objet de test directement inclus dans le composant
  scpiData = {
    id: 3,
    name: "SmartInvest",
    minimumSubscription: 2000,
    manager: "SmartInvest Co.",
    capitalization: 200000000,
    subscriptionFees: 1.8,
    managementCosts: 1,
    enjoymentDelay: 5,
    iban: "FR761234567892",
    bic: "ABCDEFXZ",
    scheduledPayment: false,
    frequencyPayment: "Trimestrielle",
    cashback: 1.2,
    advertising: "Low risk, long-term returns.",
    statYears: [
      {
        year: 2023,
        distributionRate: 4.5,
        sharePrice: 120,
        reconstitutionValue: 250000000,
        scpiId: 3
      },
      {
        year: 2022,
        distributionRate: 4.6,
        sharePrice: 110,
        reconstitutionValue: 240000000,
        scpiId: 3
      },
      {
        year: 2021,
        distributionRate: 4.2,
        sharePrice: 105,
        reconstitutionValue: 230000000,
        scpiId: 3
      }
    ],
    locations: [
      {
        country: "Italy",
        countryPercentage: 20.5
      }
    ],
    sectors: [
      {
        name: "Residential",
        sectorPercentage: 40
      }
    ]
  };

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
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true, mode: 'index', intersect: false },
      },
      scales: {
        x: {
          title: { display: true, text: 'Années', color: '#666' },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: 'Valeur', color: '#666' },
          grid: { color: '#eee' },
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
    };

    // Extraction des données pour les graphiques
    const years = this.scpiData.statYears.map((stat: any) => stat.year);
    const distributionRates = this.scpiData.statYears.map((stat: any) => stat.distributionRate);
    const sharePrices = this.scpiData.statYears.map((stat: any) => stat.sharePrice);

    // Graphique du taux de distribution
    this.distributionChartData = {
      labels: years,
      datasets: [
        {
          label: 'Taux de distribution (%)',
          data: distributionRates,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
        },
      ],
    };

    // Graphique du prix de la part
    this.priceChartData = {
      labels: years,
      datasets: [
        {
          label: 'Prix de la part (€)',
          data: sharePrices,
          borderColor: '#FFA726',
          backgroundColor: 'rgba(255, 167, 38, 0.2)',
          fill: true,
        },
      ],
    };
  }
}
