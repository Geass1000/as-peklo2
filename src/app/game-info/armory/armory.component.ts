import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
import { IRGameInfo, IResources, IArmory, ICostArmory, ICost, IRGameArmory, IGameArmory } from '../../shared/interfaces/game.interface';

/* App Validators */
import { isNumber } from '../../shared/validators/is-number.validator';

@Component({
  selector : 'as-armory',
  templateUrl : './armory.component.html',
  styleUrls : [ './armory.component.scss' ]
})
export class ArmoryComponent implements OnInit, OnDestroy {
	/* Input */
	@Input('dataType') dataType : string;

	/* Public Variable */
	public form : FormGroup;
	public formChange : Subscription;
	public current : number;
	public result : number;
	private lang : any;

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['state', 'armory']) stateArmory$ : Observable<IArmory>;
	public stateArmory : IArmory;
	@select(['state', 'order']) stateOrder$ : Observable<IArmory>;
	public stateOrder : IArmory;

  constructor(private fb : FormBuilder,
						 	private ngRedux : NgRedux<any>,
						 	private appActions : AppActions,
						 	private logger : LoggerService) {
		this.lang = lang;
	}

  ngOnInit() {
		this.logger.info(`${this.constructor.name} - ngOnInit:`, this.dataType);
		this.buildForm();
		this.stateArmory$.combineLatest(this.stateOrder$).subscribe((data) => {
			this.logger.info(`${this.constructor.name} - ngOnInit`, data);
			if (!(data[0] && data[1])) {
				return;
			}
			this.stateArmory = data[0];
			this.stateOrder = data[1];
			this.current = +this.stateArmory[this.dataType];
			const order : string = this.stateOrder[this.dataType];
			this.result = this.current + 5 * (+order);
		});
  }
	ngOnDestroy () : void {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * buildForm - method performs create form and one registration on form events.
	 *
	 * @function
	 * @return {void}
	 */
	buildForm () : void {
		const fieldForm : { [key : string] : any } = {};
		fieldForm[this.dataType] = [ '0', [
			Validators.required, isNumber(false)
		]];

		this.form = this.fb.group(fieldForm);

		const sub : Subscription = this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));
		this.subscription.push(sub);
	}

	onValueChanged (data?: any) : void {
		const methodName : string = 'onValueChanged';

		let formValue : string;
		if (this.form.invalid) {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Form invalid -', this.dataType);
			formValue = '0';
		} else {
			this.logger.info(`${this.constructor.name} - ${methodName}:`, 'Form valid -', this.dataType);
			formValue = this.form.get(this.dataType).value;
		}

		const resultOrder : IArmory = Object.assign({}, this.stateOrder);
		resultOrder[this.dataType] = formValue;
		this.ngRedux.dispatch(this.appActions.setOrder(resultOrder));
  }

	/**
	 * getUrlArmory - выполняет формирование URL изображения амуниции.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	getUrlArmory () : string {
		return `url('./assets/imgs/armory/${this.dataType}_big.png')`;
	}
	getNameArmory () : string {
		return this.lang['ru']['gameInfoArmory'][this.dataType];
	}
}
