import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* App Routing - Component */
import { GameInfoComponent } from './game-info.component';

/* App Service */
import { AuthGuard } from '../core/auth-guard.service';

const routes : Routes = [
	{ path: 'game/info', component: GameInfoComponent, canActivate: [ AuthGuard ] },
	{ path: 'game', component: GameInfoComponent, canActivate: [ AuthGuard ] }
];
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GameInfoRoutingModule { }
