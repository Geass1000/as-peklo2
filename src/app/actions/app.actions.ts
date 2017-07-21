import { Injectable } from '@angular/core';
import { IAction } from '../shared/interfaces/action.interface';

import { IArmory, IResources } from '../shared/interfaces/game.interface';

@Injectable()
export class AppActions {
	static readonly CLASS_NAME = 'AppActions:';
	static readonly OPEN_MODAL = AppActions.CLASS_NAME + 'OPEN_MODAL';
	static readonly OPEN_PANEL = AppActions.CLASS_NAME + 'OPEN_PANEL';
	static readonly CLOSE_ACTIVE_MODAL = AppActions.CLASS_NAME + 'CLOSE_ACTIVE_MODAL';

	static readonly TOGGLE_FULL_WIDTH_MODE = AppActions.CLASS_NAME + 'TOGGLE_FULL_WIDTH_MODE';
	static readonly SET_ACC = AppActions.CLASS_NAME + 'SET_ACC';
	static readonly SET_RESOURCES = AppActions.CLASS_NAME + 'SET_RESOURCES';
	static readonly SET_ARMORY = AppActions.CLASS_NAME + 'SET_ARMORY';
	static readonly SET_ORDER = AppActions.CLASS_NAME + 'SET_ORDER';

	openModal (name : string, state : boolean = true) : IAction {
    return {
      type : AppActions.OPEN_MODAL,
			payload : {
				name : name,
				state : state
			}
    };
  }
	openPanel (name : string, state : boolean = true) : IAction {
    return {
      type : AppActions.OPEN_PANEL,
			payload : {
				name : name,
				state : state
			}
    };
  }
	closeActiveModal () : IAction {
    return {
      type : AppActions.CLOSE_ACTIVE_MODAL
    };
  }

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
	setOrder (order : IArmory) : IAction {
    return {
      type : AppActions.SET_ORDER,
			payload : {	order : order	}
    };
  }
}
