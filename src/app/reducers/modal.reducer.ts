import { Reducer } from 'redux';
import { IAction } from '../shared/interfaces/action.interface';
import { AppActions } from '../actions/app.actions';

export interface IModal {
	open : boolean;
	openPanelOverlay : boolean;
	openModalOverlay : boolean;
	active : string;
	/* Modals */
	gameInfo : boolean;
}

export const INITIAL_STATE : IModal = {
	open : false,
	openPanelOverlay : false,
	openModalOverlay : false,
	active : null,
	/* Modals */
	gameInfo : false
};

export const ModalReducer : Reducer<IModal> = (state = INITIAL_STATE, action : IAction) : IModal => {
	switch (action.type) {
		case AppActions.OPEN_MODAL : {
			const modal = Object.assign({}, state, {
				openModalOverlay : action.payload.state,
				openPanelOverlay : false
			});
			if (modal.active !== null) {
				modal[modal.active] = false;
			}
			if (modal.active !== action.payload.name) {
				modal[action.payload.name] = true;
				modal.active = action.payload.name;
			}	else {
				modal.active = null;
				modal.open = false;
				modal.openModalOverlay = false;
			}
			return modal;
		}
		case AppActions.OPEN_PANEL : {
			const modal = Object.assign({}, state, {
				openPanelOverlay : action.payload.state,
				openModalOverlay : false
			});
			if (modal.active !== null) {
				modal[modal.active] = false;
			}
			if (modal.active !== action.payload.name) {
				modal[action.payload.name] = true;
				modal.active = action.payload.name;
			}	else {
				modal.active = null;
				modal.open = false;
				modal.openPanelOverlay = false;
			}
			return modal;
		}
		case AppActions.CLOSE_ACTIVE_MODAL : {
			const modal = Object.assign({}, state, {
				openModalOverlay : false,
				openPanelOverlay : false
			});
			if (modal.active !== null) {
				modal[modal.active] = false;
				modal.active = null;
			}
			return modal;
		}
	}
	return state;
};
