import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule
	],
  declarations: [
	],
  exports: [
		// Modules
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		BrowserAnimationsModule
	]
})
export class SharedModule {
}
