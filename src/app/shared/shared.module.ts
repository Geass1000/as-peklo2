import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputSelectDirective } from './directives/input-select.directive';

@NgModule({
  imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule
	],
  declarations: [
		InputSelectDirective
	],
  exports: [
		// Modules
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		//Directives
		InputSelectDirective
	]
})
export class SharedModule {
}
