import { Component, OnInit, OnDestroy } from '@angular/core';

/* App Redux and Request */
import { AppReducer, INITIAL_STATE, IApp } from './reducers/app.store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { AppActions } from './actions/app.actions';

/* App Services */
import { LoggerService } from './core/logger.service';

/* App Animations */

@Component({
	moduleId : module.id,
  selector : 'as-app',
	templateUrl : 'app.component.html',
  styleUrls : [ 'app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
	private animationState : string = 'open';

	/* Redux */
	private subscription : Array<Subscription> = [];
	@select(['state', 'fullwidthMode']) fullwidthMode$ : Observable<boolean>;

	constructor (private ngRedux : NgRedux<IApp>,
							 private appActions : AppActions,
						 	 private logger : LoggerService) {
		this.ngRedux.configureStore(AppReducer, INITIAL_STATE, null, []);
		this.logger.info(`${this.constructor.name}:`, 'Start app Artificial System!');
	}
	ngOnInit () {
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}
}
