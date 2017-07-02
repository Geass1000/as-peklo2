import { combineReducers } from 'redux';

/* Store Interfaces */
import { IState } from './state.reducer';
import { IModal } from './modal.reducer';

/* Reducers */
import { StateReducer } from './state.reducer';
import { ModalReducer } from './modal.reducer';

/* Store Initial States */
import { INITIAL_STATE as INITIAL_STATE_STATE } from './state.reducer';
import { INITIAL_STATE as INITIAL_STATE_MODAL } from './modal.reducer';

/* Store Interface */
export interface IApp {
	state : IState;
	modal : IModal;
}

/* Store Initial State */
export const INITIAL_STATE : IApp = {
	state : INITIAL_STATE_STATE,
	modal : INITIAL_STATE_MODAL
};

/* Combine State Reducers */
export const AppReducer = combineReducers<IApp>({
	state : StateReducer,
	modal : ModalReducer
});
