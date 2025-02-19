import { ScpiModel } from '@/core/model/scpi.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DividerModule,
    Tag,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.css',
})
export class ScpiCardComponent {
  @Input() scpi?: ScpiModel;
  @Input() image!: string;

  formatLocation() {
    const location = this.scpi?.location;
    if (!location) return 'N/A';
    const country = location.id?.country ?? 'N/A';
    const percentage =
      location.countryPercentage !== undefined
        ? `${location.countryPercentage}%`
        : 'N/A%';
    return `${country} - ${percentage}`;
  }

  formatSector(): string {
    const sector = this.scpi?.sector;
    if (!sector) return 'N/A';
    const name = sector.id?.name ?? 'N/A';
    const percentage =
      sector.sectorPercentage !== undefined
        ? `${sector.sectorPercentage}%`
        : '';
    return `${name} - ${percentage}`;
  }

  formatDistributionRate() {
    const distributionRate = this.scpi?.statYear?.distributionRate;
    return `Rendement - ${
      distributionRate !== undefined ? distributionRate + '%' : 'N/A'
    }`;
  }

  formatMinimum() {
    const minimumSubscription = this.scpi?.minimumSubscription;
    return `Minimum - ${
      minimumSubscription !== undefined ? minimumSubscription + ' €' : 'N/A'
    }`;
  }
}
