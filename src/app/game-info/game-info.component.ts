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
import { IRGameInfo, IResources, IArmory, ICostArmory, ICost, IRGameArmory, IGameArmory } from '../shared/interfaces/game.interface';

/* App Validators */
import { isNumber } from '../shared/validators/is-number.validator';

/* App Animations */
import { animation } from '../shared/animations/modal.animation';

const initModel : IArmory = {
	air_strike : '0',
	medicaments : '0',
	gravibomb : '0',
	shields : '0',
	space_mines : '0',
	repair_drones : '0',
	adaptive_shield : '0',
	ecm : '0'
};

const costArmory : ICostArmory = {
	air_strike : { type : 'crystal', cost : 30 },
	medicaments : { type : 'crystal', cost : 30 },
	gravibomb : { type : 'cordite', cost : 50 },
	shields : { type : 'cordite', cost : 50 },
	space_mines : { type : 'cordite', cost : 25 },
	repair_drones : { type : 'cordite', cost : 25 },
	adaptive_shield : { type : 'cordite', cost : 50 },
	ecm : { type : 'cordite', cost : 50 }
};

@Component({
	moduleId : module.id,
	selector : 'as-game-info',
	templateUrl : 'game-info.component.html',
  styleUrls : [ 'game-info.component.scss' ],
	animations : [ animation ]
})
export class GameInfoComponent implements OnInit, OnDestroy {
	public balance : IResources;
	public resultArmory : IArmory;
	public animationState : string = 'open';
	public form : FormGroup;
	public waitMin : number;
	public waitSec : number;
	public lockOrder : boolean;

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['modal', 'gameInfo']) gameInfo$ : Observable<boolean>;
	public gameInfo : boolean;
	@select(['state', 'resources']) stateResources$ : Observable<IResources>;
	public stateResources : IResources;
	@select(['state', 'armory']) stateArmory$ : Observable<IArmory>;
	public stateArmory : IArmory;

	private land : string;
	private space : string;

	constructor (private fb : FormBuilder,
						 	 private ngRedux : NgRedux<any>,
						 	 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private gameService : GameService) { ; }

	ngOnInit () : void {
		this.buildForm();
		this.lockOrder = false;
		this.subscription.push(this.gameInfo$.subscribe((data) => {
			this.gameInfo = data;
			this.animationState = data ? 'open' : '';
		}));
		this.subscription.push(this.stateResources$.subscribe((data) => {
			this.stateResources = Object.assign({}, data);
			this.balance = Object.assign({}, data);
		}));
		this.subscription.push(this.stateArmory$.subscribe((data) => {
			this.resultArmory = Object.assign({}, data);
			this.stateArmory = Object.assign({}, data);
		}));
		this.getInfo();
  }
	ngOnDestroy () : void {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * buildForm - функция-метод, выполняет создание формы и возможные регистрации
	 * на события формы.
	 *
	 * @function
	 * @return {void}
	 */
	buildForm () : void {
		this.form = this.fb.group({
      'air_strike' : [ '0', [ Validators.required, isNumber(false) ] ],
			'medicaments' : [ '0', [ Validators.required, isNumber(false) ] ],
			'gravibomb' : [ '0', [ Validators.required, isNumber(false) ] ],
			'shields' : [ '0', [ Validators.required, isNumber(false) ] ],
			'space_mines' : [ '0', [ Validators.required, isNumber(false) ] ],
			'repair_drones' : [ '0', [ Validators.required, isNumber(false) ] ],
			'adaptive_shield' : [ '0', [ Validators.required, isNumber(false) ] ],
			'ecm' : [ '0', [ Validators.required, isNumber(false) ] ],
    });

		this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
	}

	onValueChanged (data?: any) : void {
		const methodName : string = 'onValueChanged';

		if (this.form.invalid) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Form invalid');
			return;
		}

		this.balance = Object.assign({}, this.stateResources);
		this.resultArmory = Object.assign({}, this.stateArmory);
		const result : IArmory = <IArmory>Object.assign({}, this.form.value);
		this.logger.info(`${this.constructor.name} - ${methodName}:`, result);

		for (let prop in result) {
			const value : number = +result[prop];
			const cost : ICost = costArmory[prop];
		  this.balance[cost.type] -= cost.cost * value;
			this.resultArmory[prop] = (+this.resultArmory[prop] + 5 * value).toString();
		}
  }

	/**
	 * getUrlResouce - выполняет формирование URL изображения ресурсов.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	getUrlResouce (str : string) : string {
		return `url('./assets/imgs/resources/${str}_big.png')`;
	}

	/**
	 * getUrlResouce - выполняет формирование URL изображения ресурсов.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	getUrlArmory (str : string) : string {
		return `url('./assets/imgs/armory/${str}_big.png')`;
	}

	/**
	 * getUrlResouce - выполняет формирование URL изображения ресурсов.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	getValue (str : string) : number {
		return +str;
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
		if (this.form.invalid) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Form invalid');
			return;
		}
		let confirm : boolean = true;
		for(let prop in this.balance) {
			confirm = confirm && this.balance[prop] >= 0;
		}
		if (!confirm) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'All field mast be positive');
			return;
		}
		this.lockOrder = true;

		const result : IArmory = <IArmory>Object.assign({}, this.form.value);
		this.logger.info(`${this.constructor.name} - ${methodName}:`, result);
		let sum : number = 0;
		for (let prop in result) {
			sum += +result[prop];
		}
		const perf : number = 0.2;
		sum *= perf;
		this.waitMin = Math.floor(sum / 60);
		this.waitSec = Math.ceil(sum) % 60;

		this.ngRedux.dispatch(this.appActions.openModal('gameInfo'));

		const value = {
			land : this.land,
			space : this.space,
			armory : result
		}
		const sub : Subscription = this.gameService.postGetArmory(value).subscribe(
			(data : IRGameArmory) => {
				this.logger.info(`${this.constructor.name} - ${methodName}:`, data);
				this.ngOnInit();
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
