import {ScpiSimulation, Simulation} from '@/core/model/Simulation';
import {SimulationService} from '@/core/service/simulation.service';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../simulation-creator/simulation_dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-simulation-list',
  standalone: true,
  imports: [CommonModule, RouterLink,ConfirmDeleteDialogComponent],
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css'],
})
export class SimulationListComponent implements OnInit {
  simulations: Simulation[] = [];

  isDialogVisible = false;
  simulationToDelete: number | null = null;

  constructor(private simulationService: SimulationService) {
  }

  ngOnInit(): void {
    this.loadSimulations();
  }

  openDeleteDialog(simulationId: number) {
    this.simulationToDelete = simulationId;
    this.isDialogVisible = true;
  }

  confirmDelete() {
    if (this.simulationToDelete !== null) {
      this.simulations = this.simulations.filter(sim => sim.id !== this.simulationToDelete).slice();
      this.simulationToDelete = null;
    }
    this.isDialogVisible = false;
  }

  cancelDelete() {
    this.simulationToDelete = null;
    this.isDialogVisible = false;
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
