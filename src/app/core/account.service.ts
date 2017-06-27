import { Injectable, OnDestroy } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Config } from '../config';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux } from '@angular-redux/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

/* App Services */
import { LoggerService } from './logger.service';
import { HttpService } from './http.service';

/* App Interfaces and Classes */
import { ISignin, IRAcc } from '../shared/interfaces/account.interface';

@Injectable()
export class AccountService implements OnDestroy {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	/* Redux */
	private subscription : Array<Subscription> = [];

	constructor (private http : Http,
							 private authHttp : AuthHttp,
							 private ngRedux : NgRedux<any>,
							 private logger : LoggerService,
						 	 private httpService : HttpService) {
		this.init();
	}
	init () {
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	postSignin (value : ISignin) : Observable<IRAcc | string> {
		const methodName : string = 'postSignin';

		const body : string = JSON.stringify(value);

		return this.http.post(Config.accUrl, body, { headers : this.headers })
			.map<Response, IRAcc>((resp : Response) => {
				return this.httpService.mapData<IRAcc>(resp, this.constructor.name, methodName);
			})
			.catch<any, string>((error) => this.httpService.handleError(error));
	}
}
