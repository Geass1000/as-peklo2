import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/* App Redux and Request */
import { Subscription } from 'rxjs/Subscription';
import { NgRedux } from '@angular-redux/store';
import { AppActions } from '../actions/app.actions';

/* App Services */
import { LoggerService } from '../core/logger.service';
import { AccountService } from '../core/account.service';

/* App Interfaces and Classes */
import { ISignin, IRAcc } from '../shared/interfaces/account.interface';

@Component({
	moduleId: module.id,
	selector: 'as-signin',
	templateUrl: 'signin.component.html',
  styleUrls: [ 'signin.component.scss' ]
})
export class SigninComponent implements OnInit, OnDestroy {
	public form : FormGroup;

	formError = {
		'serverError' : ''
	};

	/* Redux */
	private subscription : Array<Subscription> = [];

	constructor (private fb : FormBuilder,
						 	 private ngRedux : NgRedux<any>,
						 	 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private accountService : AccountService) { ; }

	ngOnInit () : void {
		this.buildForm();
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
      'uid' : [ '', [ Validators.required ] ],
			'auth_key' : [ '', [ Validators.required ] ]
    });
	}

	/**
	 * onSubmit - функция-событие, выполняет вход пользователя в систему.
	 *
	 * @kind {event}
	 * @return {void}
	 */
	onSubmit () : void {
		const result : ISignin = <ISignin>Object.assign({}, this.form.value);
		const sub : Subscription = this.accountService.postSignin(result).subscribe(
			(data : IRAcc) => {
				this.ngRedux.dispatch(this.appActions.setSid(data.sid));
				this.formError.serverError = '';
			},
			(error : string) => {
				this.formError.serverError = error;
			}
		);
		this.subscription.push(sub);
	}
}
