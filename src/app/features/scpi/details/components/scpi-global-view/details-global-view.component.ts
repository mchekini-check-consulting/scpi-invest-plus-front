import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { Details } from '@/core/model/Details';
import { Location } from '@/core/model/Location';
import { Sector } from '@/core/model/Sector';
import { StatYear } from '@/core/model/StatYear';
import { DetailsDetailsService } from '@/core/service/details-details.service';
import { MapComponent } from '@/shared/component/map/map.component';

@Component({
  selector: 'app-details-global-view',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    PanelModule,
    ChartModule,
    MapComponent,
  ],
  templateUrl: './details-global-view.component.html',
  styleUrl: './details-global-view.component.css',
})
export class DetailsGlobalViewComponent implements OnInit {
  @Input() details: Details | null = null;
  states: StatYear | null = null;
  ListeLocations: Location[] = [];
  ListeSectors: Sector[] = [];
  data: any = [];
  sectorData: any;
  options: any;

  @Input() id_parent: number = 0;
  platformId = inject(PLATFORM_ID);

  detailsService = inject(DetailsDetailsService);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getScpiGlobalInformation();
  }

  getScpiGlobalInformation() {
    if (!this.details) return;
    this.states = this.detailsService.getLastStats(this.details);
    this.ListeLocations = this.details.locations;
    this.ListeSectors = this.details.sectors;
    this.initChart(this.ListeLocations);
    this.cd.detectChanges();
    this.initSectorPieChart(this.ListeSectors);
    this.cd.detectChanges();
  }

  initChart(dataEntry: Location[] | Sector[]) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const isLocationArray = (
        dataEntry: Location[] | Sector[]
      ): dataEntry is Location[] =>
        dataEntry.length > 0 && 'country' in dataEntry[0];

      this.data = {
        labels: isLocationArray(dataEntry)
          ? dataEntry.map((x) => x.id.country)
          : dataEntry.map((x) => x.id.name),
        datasets: [
          {
            data: isLocationArray(dataEntry)
              ? dataEntry.map((x) => x.countryPercentage)
              : dataEntry.map((x) => x.sectorPercentage),
            backgroundColor: [
              "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
            hoverBackgroundColor: [
              "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  initSectorPieChart(dataEntry: Sector[]) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      this.sectorData = {
        labels: dataEntry.map((x) => x.id.name),
        datasets: [
          {
            data: dataEntry.map((x) => x.sectorPercentage),
            backgroundColor: [
              "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
            hoverBackgroundColor: [
             "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';

    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + 'K';
    }
    return value.toString();
  }
}
