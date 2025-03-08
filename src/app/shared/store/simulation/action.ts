import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {ScpiSimulation, Simulation, SimulationName} from '@/core/model/Simulation';
import {ErrorModel} from '@/core/model/error.model';

export const SimulationActions = createActionGroup({
  source: 'Simulation',
  events: {
    'Load Simulations': emptyProps(),
    'Load Simulations Success': props<{ simulations: Simulation[] }>(),
    'Load Simulations Failure': emptyProps(),

    'Load Simulation By ID': props<{ id: number }>(),
    'Load Simulation By ID Success': props<{ simulation: Simulation }>(),
    'Load Simulation By ID Failure': props<{ error: ErrorModel }>(),

    'Create Simulation': props<{ simulationName: SimulationName }>(),
    'Create Simulation Success': props<{ simulation: Simulation }>(),
    'Create Simulation Failure': props<{ error: ErrorModel }>(),

    'Add SCPI to Simulation': props<{ scpiSimulation: ScpiSimulation }>(),
    'Add SCPI to Simulation Success': props<{ simulation: Simulation }>(),
    'Add SCPI to Simulation Failure': props<{ error: ErrorModel }>(),
  },
});
