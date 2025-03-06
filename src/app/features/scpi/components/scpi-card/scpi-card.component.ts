import {ScpiModel} from '@/core/model/scpi.model';
import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {Tag} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ScpiInvestModalComponent} from '@/features/scpi/components/scpi-invest-modal/scpi-invest-modal.component';

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
    DialogModule,
    ScpiInvestModalComponent,
    TranslateModule,
  ],

  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.css',
})
export class ScpiCardComponent {
  @Input() scpi?: ScpiModel;
  @Input() image!: string;
  @Input() simulationId?: number;
  investirModalVisible: boolean = false;

  modalMode: string = 'investir';

  openInvestirModal() {
    this.investirModalVisible = true;
  }

  constructor(private router: Router) {
    const isSimulation = this.router.url.includes('simulation');
    this.modalMode = isSimulation ? 'simuler' : 'investir';
  }

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
    return `Rendement - ${distributionRate !== undefined ? distributionRate + '%' : 'N/A'
    }`;
  }

  getSharePrice(): number {
    return this.scpi?.statYear?.sharePrice ?? 0;
  }

  formatMinimum() {
    const minimumSubscription = this.scpi?.minimumSubscription;
    return `Minimum - ${minimumSubscription !== undefined ? minimumSubscription + ' €' : 'N/A'
    }`;
  }

  closeInvestirModal() {
    this.investirModalVisible = false;
  }
}
