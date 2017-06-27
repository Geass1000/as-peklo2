import { Reducer } from 'redux';
import { IAction } from '../shared/interfaces/action.interface';
import { AppActions } from '../actions/app.actions';

export interface IState {
	uid : string;
	auth_key : string;
	sid : string;
}

export const INITIAL_STATE : IState = {
	uid : '',
	auth_key : '',
	sid : ''
};

export const StateReducer : Reducer<IState> = (state = INITIAL_STATE, action : IAction) : IState => {
	switch (action.type) {
		case AppActions.SET_ACC : {
			return Object.assign({}, state, {
				uid : action.payload.uid,
				auth_key : action.payload.auth_key,
				sid : action.payload.sid
			});
		}
		case AppActions.SET_SID : {
			return Object.assign({}, state, {
				sid : action.payload.sid
			});
		}
	}
	return state;
};
