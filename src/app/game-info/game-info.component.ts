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
import { IRGameInfo, IResources, IArmory, ICostArmory, ICost, IRGameArmory, IGameArmory } from '../shared/interfaces/game.interface';

/* App Validators */
import { isNumber } from '../shared/validators/is-number.validator';

/* App Animations */
import { animation } from '../shared/animations/modal.animation';

const initOrder : IArmory = {
	air_strike : '0',
	medicaments : '0',
	gravibomb : '0',
	shields : '0',
	space_mines : '0',
	repair_drones : '0',
	adaptive_shield : '0',
	ecm : '0'
};

@Component({
	moduleId : module.id,
	selector : 'as-game-info',
	templateUrl : 'game-info.component.html',
  styleUrls : [ 'game-info.component.scss' ],
	animations : [ animation ]
})
export class GameInfoComponent implements OnInit, OnDestroy {
	public animationState : string = 'open';
	public waitMin : number;
	public waitSec : number;
	public lockOrder : boolean;
	public listResources : Array<string> = [ 'metal', 'crystal', 'cordite', 'fuel' ];
	public listArmories : Array<string> = [
		'air_strike', 'medicaments', 'gravibomb', 'shields',
		'space_mines', 'repair_drones', 'adaptive_shield', 'ecm'
	];

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['modal', 'gameInfo']) gameInfo$ : Observable<boolean>;
	public gameInfo : boolean;
	@select(['state', 'resources']) stateResources$ : Observable<IResources>;
	public stateResources : IResources;
	@select(['state', 'order']) stateOrder$ : Observable<IArmory>;
	public stateOrder : IArmory;

	private land : string;
	private space : string;

	constructor (private fb : FormBuilder,
						 	 private ngRedux : NgRedux<any>,
						 	 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private gameService : GameService) { ; }

	ngOnInit () : void {
		this.lockOrder = false;
		this.subscription.push(this.gameInfo$.subscribe((data) => {
			this.gameInfo = data;
			this.animationState = data ? 'open' : '';
		}));
		this.subscription.push(this.stateResources$.subscribe((data) => {
			this.stateResources = Object.assign({}, data);
		}));
		this.subscription.push(this.stateOrder$.subscribe((data) => {
			this.stateOrder = Object.assign({}, data);
		}));
		this.getInfo();
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
	getInfo () : void {
		const sub : Subscription = this.gameService.postGetInfo().subscribe(
			(data : IRGameInfo) => {
				this.ngRedux.dispatch(this.appActions.setOrder(initOrder));
				this.ngRedux.dispatch(this.appActions.setResources(data.resources));
				this.ngRedux.dispatch(this.appActions.setArmory(data.armory));
				this.land = data.land;
				this.space = data.space;
			},
			(error : string) => {
				this.logger.info(`${this.constructor.name} - getInfo:`, error);
			}
		);
		this.subscription.push(sub);
	}

	/**
	 * onClickOrder - функция-событие, выполняет заказ и получение арсенала.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	onClickOrder () : void {
		const methodName : string = 'onClickOrder';
		if (!this.stateResources || !this.stateOrder) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'All data must be receive');
			return;
		}

		let confirm : boolean = true;
		for (const prop in this.stateResources) {
			if (this.stateResources.hasOwnProperty(prop)) {
				confirm = confirm && this.stateResources[prop] >= 0;
			}
		}
		if (!confirm) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'All resources mast be positive');
			return;
		}
		this.lockOrder = true;

		let sum : number = 0;
		for (const prop in this.stateOrder) {
			if (this.stateOrder.hasOwnProperty(prop)) {
				sum += +this.stateOrder[prop];
			}
		}
		const perf : number = 0.2;
		sum *= perf;
		this.waitMin = Math.floor(sum / 60);
		this.waitSec = Math.ceil(sum) % 60;

		this.ngRedux.dispatch(this.appActions.openModal('gameInfo'));

		const value = {
			land : this.land,
			space : this.space,
			armory : this.stateOrder
		}
		this.logger.info(`${this.constructor.name} - ${methodName}:`, value);
		const sub : Subscription = this.gameService.postGetArmory(value).subscribe(
			(data : IRGameArmory) => {
				this.logger.info(`${this.constructor.name} - ${methodName}:`, data);
				this.getInfo();
			},
			(error : string) => {
				this.logger.info(`${this.constructor.name} - getInfo:`, error);
			},
			() => {
				setTimeout(() => {
					this.ngRedux.dispatch(this.appActions.closeActiveModal());
					this.lockOrder = false;
				}, 1000);
			}
		);
		this.subscription.push(sub);
	}
}
