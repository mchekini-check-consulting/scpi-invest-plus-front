import { ScpiSimulation, Simulation } from '@/core/model/Simulation';
import { SimulationService } from '@/core/service/simulation.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css'],
})
export class SimulationListComponent implements OnInit {
  simulations: Simulation[] = [];

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.loadSimulations();
  }

   calculateTotalAmount(scpiSimulations: ScpiSimulation[]): number {
    return scpiSimulations.reduce((total, scpi) => {
      return total + scpi.rising;
    }, 0);
  }

  loadSimulations(): void {
    this.simulationService.getSimulations().subscribe({
      next: (response: Simulation[]) => {
        this.simulations = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des simulations', error);
      },
    });
  }
}
