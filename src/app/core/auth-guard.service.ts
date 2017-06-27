import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

/* App Services */
import { LoggerService } from './logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor (private router: Router,
							 private logger : LoggerService) { ; }

	/**
	 * canActivate - выполняет проверку перехода.
	 *
	 * @method
	 *
	 * @return {boolean}
	 */
  canActivate() {
		return true;
  }
}
