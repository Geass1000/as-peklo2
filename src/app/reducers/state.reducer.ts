import { Reducer } from 'redux';
import { IAction } from '../shared/interfaces/action.interface';
import { AppActions } from '../actions/app.actions';

export interface IState {
	sid : string;
}

export const INITIAL_STATE : IState = {
	sid : ''
};

export const StateReducer : Reducer<IState> = (state = INITIAL_STATE, action : IAction) : IState => {
	switch (action.type) {
		case AppActions.SET_SID : {
			return Object.assign({}, state, {
				sid : action.payload.sid
			});
		}
	}
	return state;
};
