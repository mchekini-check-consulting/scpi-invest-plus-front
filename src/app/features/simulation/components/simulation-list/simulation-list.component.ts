import {ScpiSimulation, Simulation} from '@/core/model/Simulation';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectAllSimulations} from '@/shared/store/simulation/selectors';
import {SimulationActions} from '@/shared/store/simulation/action';

@Component({
  selector: 'app-simulation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css'],
})
export class SimulationListComponent {
  simulations$: Observable<Simulation[]> = new Observable<Simulation[]>();

  constructor(private store: Store) {
    this.store.dispatch(SimulationActions.loadSimulations());
    this.simulations$ = this.store.select(selectAllSimulations)
  }

  calculateTotalAmount(scpiSimulations: ScpiSimulation[]): number {
    return scpiSimulations.reduce((total, scpi) => {
      return total + scpi.rising;
    }, 0);
  }

}
