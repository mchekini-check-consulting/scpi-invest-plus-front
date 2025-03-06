import {Component, OnInit} from '@angular/core';
import {
  AddScpiToSimulationComponent
} from '@/features/simulation/components/add-scpi-to-simulation/add-scpi-to-simulation.component';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {ScpiSimulation, Simulation} from '@/core/model/Simulation';
import {Panel} from 'primeng/panel';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {MapComponent} from '@/shared/component/map/map.component';
import {Location} from '@/core/model/Location';
import {ChartModule} from 'primeng/chart';
import {Sector} from '@/core/model/Sector';
import {Store} from '@ngrx/store';
import {SimulationActions} from '@/shared/store/simulation/action';
import {selectSelectedSimulation} from '@/shared/store/simulation/selectors';
import {filter, Observable, tap} from 'rxjs';

@Component({
  selector: 'app-simulation-detail',
  imports: [
    AddScpiToSimulationComponent,
    Card,
    PrimeTemplate,
    Panel,
    DecimalPipe,
    MapComponent,
    ChartModule,
    AsyncPipe
  ],
  templateUrl: './simulation-detail.component.html',
  styleUrls: ['./simulation-detail.component.css'],
})
export class SimulationDetailComponent implements OnInit {
  simulationId: string = '';
  simulation$: Observable<Simulation> = new Observable<Simulation>();
  ListeLocations: Location[] = [];

  options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  sectorData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5A54F9', '#8674FC', '#C084FC'],
        hoverBackgroundColor: ['#7165FA', '#9D8AFC', '#D29FFC'],
      },
    ],
  };


  geographicalData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5A54F9', '#8674FC', '#C084FC'],
        hoverBackgroundColor: ['#7165FA', '#9D8AFC', '#D29FFC'],
      },
    ],
  };


  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.simulationId = id;
      this.store.dispatch(SimulationActions.loadSimulationByID({id: +this.simulationId}));
      this.simulation$ = this.store.select(selectSelectedSimulation).pipe(
        filter(Boolean),
        tap(simulation => {
          this.updateSectorData(simulation);
          this.updateLocationData(simulation);
          this.updateScpiInvestmentData(simulation);
        })
      );
    }
  }

  ngOnInit(): void {
  }

  updateSectorData(simulation: Simulation): void {
    if (simulation?.sectors && simulation.sectors.length > 0) {
      this.sectorData.labels = simulation.sectors.map(
        (sector: Sector) =>
          sector.id.name + ' (' + sector.sectorPercentage + '%)'
      );
      this.sectorData.datasets[0].data = simulation.sectors.map(
        (sector: Sector) => sector.sectorPercentage
      );
    }
  }

  updateScpiInvestmentData(simulation: Simulation): void {
    if (simulation?.scpiSimulations && simulation.scpiSimulations.length > 0) {
      const totalInvestment = simulation.totalInvestment;

      if (totalInvestment === 0) {
        console.warn("⚠️ Le total de l'investissement est à 0, impossible de calculer les pourcentages.");
        return;
      }

      this.geographicalData.labels = simulation.scpiSimulations.map(
        (scpi: ScpiSimulation) => scpi.scpiName || `SCPI ${scpi.scpiId}`
      );

      this.geographicalData.datasets[0].data = simulation.scpiSimulations.map(
        (scpi: ScpiSimulation) => parseFloat(((scpi.rising / totalInvestment) * 100).toFixed(2))
      );


    }
  }


  updateLocationData(simulation: Simulation): void {
    if (
      simulation?.locations &&
      Array.isArray(simulation.locations)
    ) {
      this.ListeLocations = simulation.locations.map((location: any) => ({
        countryPercentage: location.countryPercentage,
        id: {
          scpiId: location.id.scpiId,
          country: location.id.country,
        },
      }));
    }
  }
}
