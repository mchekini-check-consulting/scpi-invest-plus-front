import {createReducer, on} from '@ngrx/store';
import {Simulation} from '@/core/model/Simulation';
import {SimulationActions} from '@/shared/store/simulation/action';
import {ErrorModel} from '@/core/model/error.model';

export enum LoadState {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface SimulationState {
  simulations: Simulation[];
  selectedSimulation: Simulation | null;
  status: LoadState;
  error?: ErrorModel
}

export const initialSimulationState: SimulationState = {
  simulations: [],
  selectedSimulation: null,
  status: LoadState.SUCCESS,
};

export const simulationReducer = createReducer(
  initialSimulationState,

  on(SimulationActions.loadSimulations, (state) => ({
    ...state,
    status: LoadState.PENDING,
    error: undefined,
  })),

  on(SimulationActions.loadSimulationsSuccess, (state, {simulations}) => ({
    ...state,
    simulations,
    status: LoadState.SUCCESS,
    error: undefined,
  })),

  on(SimulationActions.loadSimulationsFailure, (state) => ({
    ...state,
    status: LoadState.ERROR, error: undefined,
  })),

  on(SimulationActions.loadSimulationByID, (state) => ({
    ...state,
    status: LoadState.PENDING,
    error: undefined,
  })),

  on(SimulationActions.loadSimulationByIDSuccess, (state, {simulation}) => ({
    ...state,
    selectedSimulation: simulation,
    status: LoadState.SUCCESS,
    error: undefined,
  })),

  on(SimulationActions.loadSimulationByIDFailure, (state, {error}) => ({
    ...state,
    status: LoadState.ERROR,
    error
  })),

  on(SimulationActions.createSimulation, (state) => ({
    ...state,
    status: LoadState.PENDING,
    error: undefined,
  })),

  on(SimulationActions.createSimulationSuccess, (state, {simulation}) => ({
    ...state,
    simulations: [...state.simulations, simulation],
    selectedSimulation: simulation,
    status: LoadState.SUCCESS,
    error: undefined,
  })),

  on(SimulationActions.createSimulationFailure, (state, {error}) => ({
    ...state,
    status: LoadState.ERROR,
    error,
  })),

  on(SimulationActions.addSCPIToSimulation, (state) => ({
    ...state,
    status: LoadState.PENDING,
    error: undefined,
  })),

  on(SimulationActions.addSCPIToSimulationSuccess, (state, {simulation}) => ({
    ...state,
    selectedSimulation: simulation,
    status: LoadState.SUCCESS,
    error: undefined,
  })),

  on(SimulationActions.addSCPIToSimulationFailure, (state, {error}) => ({
    ...state,
    status: LoadState.ERROR,
    error
  }))
);
