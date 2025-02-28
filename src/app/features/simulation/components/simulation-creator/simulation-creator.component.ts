import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RenameSimulationDialogComponent } from './simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component';
import { AddScpiToSimulationComponent } from '../add-scpi-to-simulation/add-scpi-to-simulation.component';


@Component({
  selector: 'app-simulation-creator',
  standalone: true,
  templateUrl: './simulation-creator.component.html',
  styleUrl: './simulation-creator.component.css',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    RenameSimulationDialogComponent,
    AddScpiToSimulationComponent
  ],
})
export class SimulationCreatorComponent {
  isDialogVisible = false;
  simulationName = 'Simulation';

  openDialog() {
    this.isDialogVisible = true;
  }

  updateSimulationName(newName: string) {
    this.simulationName = newName;
  }



}
