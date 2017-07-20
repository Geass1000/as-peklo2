import { Directive, ElementRef, HostListener } from '@angular/core';

import { LoggerService } from '../../core/logger.service';

@Directive({
  selector: '[asInputSelect]'
})
export class InputSelectDirective {

  constructor(private elementRef : ElementRef,
						 	private logger : LoggerService) { }

	@HostListener('focus') onFocus () {
		this.elementRef.nativeElement.select();
	}
}
