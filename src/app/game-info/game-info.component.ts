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
import { IRGameInfo, IResources, IArmory } from '../shared/interfaces/game.interface';

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

	@select(['state', 'resources']) stateResources$ : Observable<IResources>;
	public stateResources : IResources;
	@select(['state', 'armory']) stateArmory$ : Observable<IArmory>;
	public stateArmory : IArmory;

	constructor (private fb : FormBuilder,
						 	 private ngRedux : NgRedux<any>,
						 	 private appActions : AppActions,
						 	 private logger : LoggerService,
						 	 private gameService : GameService) { ; }

	ngOnInit () : void {
		this.subscription.push(this.stateResources$.subscribe((data) => {
			this.stateResources = data;
		}));
		this.subscription.push(this.stateArmory$.subscribe((data) => {
			this.stateArmory = data;
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
				this.ngRedux.dispatch(this.appActions.setResources(data.resources));
				this.ngRedux.dispatch(this.appActions.setArmory(data.armory));
			},
			(error : string) => {
			}
		);
		this.subscription.push(sub);
	}
}
