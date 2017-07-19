import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import lang from '../../../assets/lang/lang';

/* App Redux and Request */
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { AppActions } from '../../actions/app.actions';

/* App Interfaces and Classes */
import { IRGameInfo, IResources, IArmory, ICostArmory, ICost, IRGameArmory, IGameArmory } from '../../shared/interfaces/game.interface';

@Component({
  selector : 'as-armory',
  templateUrl : './armory.component.html',
  styleUrls : [ './armory.component.scss' ]
})
export class ArmoryComponent implements OnInit, OnDestroy {
	public form : FormGroup;
	public stateArmory : IArmory;

	/* Redux */
	private subscription : Array<Subscription> = [];

  constructor() { }

  ngOnInit() {
  }
	ngOnDestroy () : void {
		this.subscription.map((data) => data.unsubscribe());
	}

	/**
	 * getUrlArmory - выполняет формирование URL изображения амуниции.
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
}
