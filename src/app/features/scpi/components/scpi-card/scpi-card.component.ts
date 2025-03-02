import { ScpiModel } from '@/core/model/scpi.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ScpiInvestModalComponent } from '../../scpi-invest-modal/scpi-invest-modal.component';
import { ScpiService } from '@/core/service/scpi.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';

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
    ToastModule,
    TranslateModule,
  ],
  providers: [MessageService],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.css',
})
export class ScpiCardComponent {
  @Input() scpi?: ScpiModel;
  @Input() image!: string;
  @Input() isAddingScpi = false;
  investirModalVisible: boolean = false;

  constructor(
    private scpiService: ScpiService,
    private router: Router,
    private messageService: MessageService
  ) {}

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

  getSharePrice(): number {
    return this.scpi?.statYear?.sharePrice ?? 0;
  }

  formatMinimum() {
    const minimumSubscription = this.scpi?.minimumSubscription;
    return `Minimum - ${
      minimumSubscription !== undefined ? minimumSubscription + ' €' : 'N/A'
    }`;
  }

  openInvestirModal() {
    this.investirModalVisible = true;
  }
  
  closeInvestirModal() {
    this.investirModalVisible = false;
  }
}
