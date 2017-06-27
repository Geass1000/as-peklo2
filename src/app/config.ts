import { environment } from '../environments/environment';

export class Config {
	static readonly apiUrl : string = environment.apiUrl ? environment.apiUrl : '';
  static readonly accUrl : string = `${Config.apiUrl}/api/account/`;

	/* Http */
	static minRetryCount : number = 5;
	static maxRetryCount : number = 15;
	static retryDelay : number = 3000;
};
