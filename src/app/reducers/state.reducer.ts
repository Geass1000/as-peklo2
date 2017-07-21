import { Reducer } from 'redux';
import { IAction } from '../shared/interfaces/action.interface';
import { AppActions } from '../actions/app.actions';

import { IResources, IArmory } from '../shared/interfaces/game.interface';

export interface IState {
	resources : IResources;
	armory : IArmory;
	order : IArmory;
}

export const INITIAL_STATE : IState = {
	resources : null,
	armory : null,
	order : null
};

export const StateReducer : Reducer<IState> = (state = INITIAL_STATE, action : IAction) : IState => {
	switch (action.type) {
		case AppActions.SET_RESOURCES : {
			return Object.assign({}, state, {
				resources : <IResources>action.payload.resources
			});
		}
		case AppActions.SET_ARMORY : {
			return Object.assign({}, state, {
				armory : <IArmory>action.payload.armory
			});
		}
		case AppActions.SET_ORDER : {
			return Object.assign({}, state, {
				order : <IArmory>action.payload.order
			});
		}
	}
	return state;
};
