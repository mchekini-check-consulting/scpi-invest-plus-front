import {Component} from '@angular/core';
import {
  AddScpiToSimulationComponent
} from '@/features/simulation/components/add-scpi-to-simulation/add-scpi-to-simulation.component';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {SimulationService} from '@/core/service/simulation.service';
import {Simulation} from '@/core/model/Simulation';
import {Panel} from 'primeng/panel';
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-simulation-detail',
  imports: [
    AddScpiToSimulationComponent,
    Card,
    PrimeTemplate,
    Panel,
    DecimalPipe
  ],
  templateUrl: './simulation-detail.component.html',
  styleUrl: './simulation-detail.component.css'
})
export class SimulationDetailComponent {
  simulationId: string = ""
  simulation: Simulation | null = null;

  constructor(private route: ActivatedRoute, private simulationService: SimulationService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.simulationId = id;
      this.simulationService.getSimulationById(id).subscribe()
      this.simulationService.simulation$.subscribe(simulation => {
        this.simulation = simulation;
      });
    }
  }

}
