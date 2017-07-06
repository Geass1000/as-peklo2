import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* App Feature - Module */
import { SharedModule } from '../shared/shared.module';

/* Routing Module */
import { GameInfoRoutingModule } from './game-info-routing.module';

/* App Feature - Component */
import { GameInfoComponent } from './game-info.component';

/* App Feature - Service */


@NgModule({
  imports:      [ SharedModule, GameInfoRoutingModule ],
  declarations: [ GameInfoComponent ],
  exports:      [ GameInfoComponent ],
  providers:    [  ]
})
export class GameInfoModule { }
