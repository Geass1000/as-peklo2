import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { AppActions } from '../actions/app.actions';

/* App Services */
import { LoggerService } from '../core/logger.service';
import { GameService } from '../core/game.service';

/* App Interfaces and Classes */
import { IState } from '../reducers/state.reducer';
import { IAcc, IRGameInfo, IResources, IArmory } from '../shared/interfaces/game.interface';

@Component({
	moduleId: module.id,
	selector: 'as-game-info',
	templateUrl: 'game-info.component.html',
  styleUrls: [ 'game-info.component.scss' ]
})
export class GameInfoComponent implements OnInit, OnDestroy {
	public metal : string;
	public cristal : string;
	public cordit : string;

	/* Redux */
	private subscription : Array<Subscription> = [];

	@select(['state']) state$ : Observable<IState>;
	public state : IState;

	constructor (private fb : FormBuilder,
						 	 private ngRedux : NgRedux<any>,
						 	 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private gameService : GameService) { ; }

	ngOnInit () : void {
		this.subscription.push(this.state$.subscribe((data) => {
			this.state = data;
			this.getInfo({
				uid : data.uid,
				auth_key : data.auth_key,
				sid : data.sid
			});
		}));
  }
	ngOnDestroy () : void {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * onSubmit - функция-событие, выполняет вход пользователя в систему.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	getInfo (data : IAcc) : void {
		const result : IAcc = <IAcc>Object.assign({}, data);
		const sub : Subscription = this.gameService.postGetInfo(result).subscribe(
			(data : IRGameInfo) => {
				this.logger.info(`${this.constructor.name} - getInfo:`, <IResources>JSON.parse(data.resources));
				this.logger.info(`${this.constructor.name} - getInfo:`, <IArmory>JSON.parse(data.armory));
				//this.ngRedux.dispatch(this.appActions.setAcc(result.uid, result.auth_key, data.sid));
			},
			(error : string) => {
			}
		);
		this.subscription.push(sub);
	}
}
