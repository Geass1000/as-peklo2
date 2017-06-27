import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgReduxModule } from '@angular-redux/store';

/* Feature Modules */
import { CoreModule } from './core/core.module';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* App Root */
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SigninComponent } from './signin/signin.component';
import { GameInfoComponent } from './game-info/game-info.component';

/* App Root - Actions */
import { AppActions } from './actions/app.actions';

@NgModule({
  imports: [
		BrowserModule,
		BrowserAnimationsModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		NgReduxModule,
		AppRoutingModule
	],
  declarations: [
		AppComponent,
		NotFoundComponent,
		SigninComponent,
		GameInfoComponent
	],
	providers: [
		AppActions
	],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
