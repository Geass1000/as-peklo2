import { Injectable } from '@angular/core';
import { IAction } from '../shared/interfaces/action.interface';

import { IArmory, IResources } from '../shared/interfaces/game.interface';

@Injectable()
export class AppActions {
	static readonly CLASS_NAME = 'AppActions:';
	static readonly TOGGLE_FULL_WIDTH_MODE = AppActions.CLASS_NAME + 'TOGGLE_FULL_WIDTH_MODE';
	static readonly SET_ACC = AppActions.CLASS_NAME + 'SET_ACC';
	static readonly SET_RESOURCES = AppActions.CLASS_NAME + 'SET_RESOURCES';
	static readonly SET_ARMORY = AppActions.CLASS_NAME + 'SET_ARMORY';

	setAcc (uid : string, auth_key : string, sid : string) : IAction {
    return {
      type : AppActions.SET_ACC,
			payload : {	uid : uid, auth_key : auth_key, sid : sid }
    };
  }
	setResources (resources : IResources) : IAction {
    return {
      type : AppActions.SET_RESOURCES,
			payload : {	resources : resources	}
    };
  }
	setArmory (armory : IArmory) : IAction {
    return {
      type : AppActions.SET_ARMORY,
			payload : {	armory : armory	}
    };
  }
}
