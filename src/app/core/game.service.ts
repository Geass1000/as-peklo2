import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { Config } from '../config';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux } from '@angular-redux/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/observable/throw';

/* App Services */
import { LoggerService } from './logger.service';
import { HttpService } from './http.service';

/* App Interfaces and Classes */
import { ISignin, IRSignin, IAcc, IRGameInfo, IGameArmory, IRGameArmory } from '../shared/interfaces/game.interface';

@Injectable()
export class GameService implements OnDestroy {
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private jwtHelper : JwtHelper;

	/* Redux */
	private subscription : Array<Subscription> = [];

	constructor (private router: Router,
							 private http : Http,
							 private authHttp : AuthHttp,
							 private ngRedux : NgRedux<any>,
							 private logger : LoggerService,
						 	 private httpService : HttpService) {
		this.init();
	}
	init () {
		this.jwtHelper = new JwtHelper();
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * login - функция-метод, выполняет вход пользователя в систему.
	 * Выполняет распаковку токена и установку пользовательских данных в хранилище.
	 *
	 * @method
	 *
	 * @param {string} token - jwt-токен
	 * @return {void}
	 */
	login (token ?: string) : boolean {
		if (!token && !this.loggedIn()) {
			this.logger.info(`${this.constructor.name} - login:`, 'User isn\'t logined!');
			return ;
		}
		token = token ? token : localStorage.getItem('token');
		localStorage.setItem('token', token);
		try {
			const decodeToken = this.jwtHelper.decodeToken(token);
			this.logger.info(`${this.constructor.name} - login:`, 'decodeToken -', decodeToken);
		} catch (error) {
			this.logger.warn(`${this.constructor.name} - login:`, 'Token isn\'t exist');
		}
		this.router.navigateByUrl('/');
		return this.loggedIn();
	}

	/**
	 * logout - функция-метод, выполняет выход пользователя из системы.
	 * Выполняет удаление пользовательских данных из хранилища.
	 *
	 * @method
	 *
	 * @return {void}
	 */
	logout () : void {
		localStorage.removeItem('token');
		this.router.navigateByUrl('/signin');
	}

	/**
	 * loggedIn - функция-метод, выполняет проверку: "Находится ли пользователь в системе?".
	 *
	 * @method
	 *
	 * @return {boolean}
	 */
	loggedIn () : boolean {
		try {
			return tokenNotExpired('token');
		} catch (error) {
			return false;
		}
	}

	/**
		* postLogin - функция-репитер, выполняет повторный вход в систему, если
		* пользователь уже входил на данном компьютере.
		*
		* @method
		*
		* @param {string} userId - id пользователя (уникальный)
		* @return {Observable<IRSignin>}
		*/
	postLogin () : Observable<IRSignin | string> {
		const methodName : string = 'postLogin';

		const token = localStorage.getItem('token');
		const decodeToken = this.jwtHelper.decodeToken(token);
		const value : ISignin = {
			uid : decodeToken.uid,
			auth_key : decodeToken.auth_key
		};

		const obs : Observable<IRSignin | string> = this.postSignin(value);
		const sub : Subscription = obs.subscribe((data : IRSignin) => this.login(data.token));
		this.subscription.push(sub);
		return obs;
	}

	/**
		* postSignin - функция-запрос, выполняет повторный вход в систему.
		*
		* @method
		*
		* @param {ISignin} value - данные с uid и auth_key
		* @return {Observable<IRSignin>}
		*/
	postSignin (value : ISignin) : Observable<IRSignin | string> {
		const methodName : string = 'postSignin';

		const body : string = JSON.stringify(value);

		return this.http.post(Config.gameUrl + 'account', body, { headers : this.headers })
			.map<Response, IRSignin>((resp : Response) => {
				return this.httpService.mapData<IRSignin>(resp, this.constructor.name, methodName);
			})
			.catch<any, string>((error) => this.httpService.handleError(error));
	}

	/**
		* postGetInfo - функция-запрос, выполняет получение данных аккаунта игры.
		*
		* @method
		*
		* @return {Observable<IRGameInfo>}
		*/
	postGetInfo () : Observable<IRGameInfo | string> {
		const methodName : string = 'postGetInfo';

		return this.authHttp.post(Config.gameUrl + 'info', null, { headers : this.headers })
			.map<Response, IRGameInfo>((resp : Response) => {
				return this.httpService.mapData<IRGameInfo>(resp, this.constructor.name, methodName);
			})
			.retryWhen((errObs : any) => {
				return errObs.delayWhen(val => this.postLogin());
			})
			.catch<any, string>((error) => this.httpService.handleError(error));
	}

	/**
		* postGetInfo - функция-запрос, выполняет получение данных аккаунта игры.
		*
		* @method
		*
		* @return {Observable<IRGameInfo>}
		*/
	postGetArmory (value : IGameArmory) : Observable<IRGameArmory | string> {
		const methodName : string = 'postGetInfo';

		const body : string = JSON.stringify(value);

		return this.authHttp.post(Config.gameUrl + 'armory', body, { headers : this.headers })
			.map<Response, IRGameArmory>((resp : Response) => {
				return this.httpService.mapData<IRGameArmory>(resp, this.constructor.name, methodName);
			})
			.retryWhen((errObs : any) => {
				return errObs.delayWhen(val => this.postLogin());
			})
			.catch<any, string>((error) => this.httpService.handleError(error));
	}
}
