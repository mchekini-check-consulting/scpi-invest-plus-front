import { Component } from '@angular/core';
import { SimulationCreatorComponent } from '../components/simulation-creator/simulation-creator.component';
import { SimulationListComponent } from '../components/simulation-list/simulation-list.component';

@Component({
  selector: 'app-simulation',
  imports: [SimulationCreatorComponent,SimulationListComponent],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css',
})
export class SimulationComponent {}
