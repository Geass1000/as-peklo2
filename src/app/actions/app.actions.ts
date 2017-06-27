import { Injectable } from '@angular/core';
import { IAction } from '../shared/interfaces/action.interface';

@Injectable()
export class AppActions {
	static readonly CLASS_NAME = 'AppActions:';
	static readonly TOGGLE_FULL_WIDTH_MODE = AppActions.CLASS_NAME + 'TOGGLE_FULL_WIDTH_MODE';
	static readonly SET_ACC = AppActions.CLASS_NAME + 'SET_ACC';
	static readonly SET_SID = AppActions.CLASS_NAME + 'SET_SID';

	setAcc (uid : string, auth_key : string, sid : string) : IAction {
    return {
      type : AppActions.SET_ACC,
			payload : {	uid : uid, auth_key : auth_key, sid : sid }
    };
  }
	setSid (sid : string) : IAction {
    return {
      type : AppActions.SET_SID,
			payload : {	sid : sid	}
    };
  }
}
