import { ScpiModel } from '@/core/model/scpi.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CardModule, ButtonModule, DividerModule, Tag, CommonModule],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.css',
})
export class ScpiCardComponent {
  @Input() scpi!: ScpiModel;
  @Input() image!: string;

  getHighestLocation() {
    const location = this.scpi.locations.reduce(
      (max, loc) => (loc.countryPercentage > max.countryPercentage ? loc : max),
      this.scpi.locations[0]
    );
    return location.id.country + ' - ' + location.countryPercentage;
  }

  getHighestSector() {
    const sector = this.scpi.sectors.reduce(
      (max, sec) => (sec.sectorPercentage > max.sectorPercentage ? sec : max),
      this.scpi.sectors[0]
    );
    return sector.id.name + ' - ' + sector.sectorPercentage;
  }
}
