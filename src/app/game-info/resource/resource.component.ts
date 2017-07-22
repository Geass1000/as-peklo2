import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import lang from '../../../assets/lang/lang';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { AppActions } from '../../actions/app.actions';
import 'rxjs/add/operator/combineLatest';

/* App Services */
import { LoggerService } from '../../core/logger.service';

/* App Interfaces and Classes */
import { IResources, IArmory, ICostArmory, ICost } from '../../shared/interfaces/game.interface';

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
  selector: 'as-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit, OnDestroy {
	/* Input */
	@Input('dataType') dataType : string;

	/* Public Variable */
	public balance : number;
	public residual : number;

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['state', 'resources']) stateResources$ : Observable<IResources>;
	public stateResources : IResources;
	@select(['state', 'order']) stateOrder$ : Observable<IArmory>;
	public stateOrder : IArmory;

  constructor(private ngRedux : NgRedux<any>,
							private appActions : AppActions,
							private logger : LoggerService) {
	}
  ngOnInit() {
		this.logger.info(`${this.constructor.name} - ngOnInit:`, this.dataType);
		const sub : Subscription = this.stateResources$.combineLatest(this.stateOrder$).subscribe((data) => {
			this.logger.info(`${this.constructor.name} - ngOnInit`, data);
			if (!(data[0] && data[1])) {
				return;
			}
			this.stateResources = data[0];
			this.stateOrder = data[1];
			this.balance = +this.stateResources[this.dataType];
			this.calcResidual();
		});
		this.subscription.push(sub);
  }
	ngOnDestroy () : void {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * getUrlResouce - выполняет формирование URL изображения ресурсов.
	 *
	 * @kind {method}
	 * @return {void}
	 */
	getUrlResouce () : string {
		return `url('./assets/imgs/resources/${this.dataType}_big.png')`;
	}

	/**
	 * calcResidual - method calculate residual resource.
	 *
	 * @kind {method}
	 * @return {void}
	 */
	calcResidual () : void {
		this.residual = this.balance;
		for (const prop in costArmory) {
			if (costArmory.hasOwnProperty(prop)) {
				const cost : ICost = costArmory[prop];
				if (cost.type !== this.dataType) {
					continue;
				}
				const value : number = +this.stateOrder[prop];
			  this.residual -= cost.cost * value;
			}
		}
	}
}
