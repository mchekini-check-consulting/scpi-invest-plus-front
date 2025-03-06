import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {
  RenameSimulationDialogComponent
} from './simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component';
import {AddScpiToSimulationComponent} from '../add-scpi-to-simulation/add-scpi-to-simulation.component';
import {SimulationService} from '../../../../core/service/simulation.service';
import {UserService} from '@/core/service/user.service';
import {Store} from '@ngrx/store';
import {SimulationActions} from '@/shared/store/simulation/action';
import {Observable} from 'rxjs';
import {Simulation} from '@/core/model/Simulation';
import {selectSelectedSimulation} from '@/shared/store/simulation/selectors';

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
export class SimulationCreatorComponent implements OnInit {
  isDialogVisible = false;
  simulationName = 'Simulation';
  investorEmail: string = '';
  simulationId: number = -1;
  simulation$: Observable<Simulation | null> = new Observable<Simulation>();

  constructor(
    private simulationService: SimulationService,
    private userService: UserService,
    private store: Store
  ) {
    this.simulation$ = this.store.select(selectSelectedSimulation)
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
    this.store.dispatch(SimulationActions.createSimulation({
      simulationName: {
        name: newName,
        simulationDate: formattedDate,
        investorEmail: this.investorEmail,
      }
    }))

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
