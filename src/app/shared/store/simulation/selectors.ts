import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SimulationState} from './reducer';

export const selectSimulationState = createFeatureSelector<SimulationState>('simulation');

export const selectAllSimulations = createSelector(
  selectSimulationState,
  (state) => state.simulations
);

export const selectSelectedSimulation = createSelector(
  selectSimulationState,
  (state) => state.selectedSimulation
);

export const selectStatusAndError = createSelector(
  selectSimulationState,
  (state) => ({
    status: state.status,
    error: state.error
  })
);
