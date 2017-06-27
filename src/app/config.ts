import { environment } from '../environments/environment';

export class Config {
	static readonly apiUrl : string = environment.apiUrl ? environment.apiUrl : '';
  static readonly projectUrl : string = `${Config.apiUrl}/api/project/`;

	/* Http */
	static minRetryCount : number = 5;
	static maxRetryCount : number = 15;
	static retryDelay : number = 3000;
};
