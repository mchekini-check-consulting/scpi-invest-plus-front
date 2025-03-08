import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RenameSimulationDialogComponent } from './simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component';
import { AddScpiToSimulationComponent } from '../add-scpi-to-simulation/add-scpi-to-simulation.component';
import { SimulationService } from '../../../../core/service/simulation.service';
import { UserService } from '@/core/service/user.service';

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
    AddScpiToSimulationComponent,
  ],
})
export class SimulationCreatorComponent implements OnInit{
  isDialogVisible = false;
  simulationName = 'Simulation';
  investorEmail: string = '';
  simulationId : number = -1;

  constructor(
    private simulationService: SimulationService,
    private userService: UserService
  )
  {

  }
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user && user.email) {
        this.investorEmail = user.email;
      }
    });
    console.log("Email user = ", this.investorEmail)
  }
  openDialog() {
    this.isDialogVisible = true;
  }

  updateSimulationName(newName: string) {
    if (!newName.trim()) {
      return;
    }
    const formattedDate = new Date().toISOString().split('T')[0];
    this.simulationService
      .createSimulation({
        name: newName,
        simulationDate: formattedDate,
        investorEmail: this.investorEmail,
      })
      .subscribe({
        next: (response) => {
          this.simulationId = response.id
        },
        error: (error) => {
          console.error('Erreur lors de la création de la simulation', error);
        },
      });

    this.simulationName = newName;
  }
}
