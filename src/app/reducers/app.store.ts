import { combineReducers } from 'redux';

/* Store Interfaces */
import { IState } from './state.reducer';

/* Reducers */
import { StateReducer } from './state.reducer';

/* Store Initial States */
import { INITIAL_STATE as INITIAL_STATE_STATE } from './state.reducer';

/* Store Interface */
export interface IApp {
	state : IState;
}

/* Store Initial State */
export const INITIAL_STATE : IApp = {
	state : INITIAL_STATE_STATE
};

/* Combine State Reducers */
export const AppReducer = combineReducers<IApp>({
	state : StateReducer
});
