import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

/* App Redux and Request */
import { AppReducer, INITIAL_STATE, IApp } from './reducers/app.store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { AppActions } from './actions/app.actions';

/* App Services */
import { LoggerService } from './core/logger.service';
import { GameService } from './core/game.service';

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
	@select(['modal', 'openModalOverlay']) openModalOverlay$ : Observable<boolean>;
	@select(['state', 'sid']) sid$ : Observable<string>;

	constructor (private router: Router,
							 private ngRedux : NgRedux<IApp>,
							 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private gameService : GameService) {
		this.ngRedux.configureStore(AppReducer, INITIAL_STATE, null, []);
		this.logger.info(`${this.constructor.name}:`, 'Start app Artificial System!');
		const isLogin : boolean = this.gameService.login();
		if (!isLogin) {
			this.router.navigateByUrl('/signin');
		}
	}
	ngOnInit () {
	}
	ngOnDestroy () {
		this.subscription.map((data) => data.unsubscribe());
	}

	loggedIn () {
		return this.gameService.loggedIn();
	}
	logout () {
		this.gameService.logout();
	}
}
