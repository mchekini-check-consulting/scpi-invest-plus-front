import { Component } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-scpi-history-details',
  templateUrl: './scpi-history-details.component.html',
  styleUrls: ['./scpi-history-details.component.scss'],
  imports: [

    NgxChartsModule
  ],
})
export class ScpiHistoryDetailsComponent {
  // Données fictives pour l'évolution du taux de distribution
  distributionData = [
    {
      "name": "Taux de distribution",
      "series": [
        { "name": "2019", "value": 4.5 },
        { "name": "2020", "value": 2.8 },
        { "name": "2021", "value": 4.2 },
        { "name": "2022", "value": 4.6 },
        { "name": "2023", "value": 4.9 }
      ]
    }
  ];

  priceData = [
    {
      "name": "Prix de la part",
      "series": [
        { "name": "2019", "value": 100 },
        { "name": "2020", "value": 105 },
        { "name": "2021", "value": 12 },
        { "name": "2022", "value": 110 },
        { "name": "2023", "value": 55 }
      ]
    }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.distributionData = [...this.distributionData];
      this.priceData = [...this.priceData];
    }, 100);
  }
  // Vérification de la disponibilité des données
  hasDistributionData(): boolean {
    return this.distributionData.length > 0;
  }

  hasPriceData(): boolean {
    return this.priceData.length > 0;
  }
}
