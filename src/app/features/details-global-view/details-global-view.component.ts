import { ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { Details } from '../../models/class/Details';
import { DetailsDetailsService } from '../../services/details-details.service';
import { StatYear } from '../../models/class/StatYear';
import { Location } from '../../models/class/Location';
import { Sector } from '../../models/class/Sector';
// import { AgmCoreModule } from '@agm/core';
@Component({
    selector: 'app-details-global-view',
    imports: [CommonModule, FormsModule, ButtonModule, CardModule, DividerModule, PanelModule, ChartModule],
    templateUrl: './details-global-view.component.html',
    styleUrl: './details-global-view.component.css'
})
export class DetailsGlobalViewComponent implements OnInit {
    details: Details | null = null;
    states: StatYear | null = null;
    ListeLocations: Location[] | null = null;
    ListeSectors : Sector[] = [];
    data: any = [];
    sectorData: any;
    options: any;

    @Input() id_parent: number = 0;
    platformId = inject(PLATFORM_ID);

    detailsService = inject(DetailsDetailsService);
    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getScpiGlobalInformation();
        // this.initChart();
    }

    getScpiGlobalInformation() {
        this.detailsService.getDetailsScpi(this.id_parent).subscribe(res => {
            this.details = res;
            this.states = this.details.statYears && this.details.statYears.length > 0
                ? this.details.statYears.reduce((prev, current) => (prev.year > current.year ? prev : current))
                : null;

            this.ListeLocations = this.details.locations;
            this.ListeSectors = this.details.sectors;
            console.log("Locations = ", this.ListeLocations);
            console.log("map log = ", this.ListeLocations?.map(x => x.country));
            console.log("map percentage = ", this.ListeLocations?.map(x => x.countryPercentage));
        
            this.initChart(this.ListeLocations);  // Maintenant, on initialise le pie chart après avoir les données
            this.cd.detectChanges();
            this.initSectorPieChart(this.ListeSectors);
            this.cd.detectChanges(); // Force la détection de changements dans le template
        
        }, (error) => {
            console.log("Error occurred during the loading of the informations.");
            console.error(error);
        });
    }

    /*Pie chart */
    initChart(dataEntry: Location[] | Sector[]) {
        if (isPlatformBrowser(this.platformId)) {

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            const isLocationArray = (dataEntry: Location[] | Sector[]): dataEntry is Location[] =>
                dataEntry.length > 0 && "country" in dataEntry[0];

            this.data = {
                labels: isLocationArray(dataEntry) ? dataEntry.map(x => x.country) : dataEntry.map(x => x.name),
                datasets: [
                    {
                        data: isLocationArray(dataEntry) ? dataEntry.map(x => x.countryPercentage) : dataEntry.map(x => x.sectorPercentage),
                        backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
                    }
                ]
            };

            this.options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
            this.cd.markForCheck();
        }
    }

    /*Sector pie */
    initSectorPieChart(dataEntry: Sector[]){
        if (isPlatformBrowser(this.platformId)) {

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

           
            this.sectorData = {
                labels:  dataEntry.map(x => x.name),
                datasets: [
                    {
                        data:  dataEntry.map(x => x.sectorPercentage),
                        backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
                    }
                ]
            };

            this.options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
            this.cd.markForCheck();
        }
    }

    formatNumber(value: number | null | undefined): string {
        if (!value) return 'N/A';
      
        if (value >= 1_000_000) {
          return (value / 1_000_000).toFixed(1) + 'M';
        } else if (value >= 1_000) {
          return (value / 1_000).toFixed(1) + 'K';
        }
      
        return value.toString();
      }
      

}
