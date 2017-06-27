import { environment } from '../environments/environment';

export class Config {
	static readonly apiUrl : string = environment.apiUrl ? environment.apiUrl : '';
  static readonly gameUrl : string = `${Config.apiUrl}/api/game/`;

	/* Http */
	static minRetryCount : number = 5;
	static maxRetryCount : number = 15;
	static retryDelay : number = 3000;
};
