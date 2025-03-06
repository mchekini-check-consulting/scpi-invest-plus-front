import {ActionReducerMap} from '@ngrx/store';
import {AppState} from './app.state';
import {simulationReducer} from './simulation/reducer';

export const appReducer: ActionReducerMap<AppState> = {
  simulation: simulationReducer,
};
