import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* App Routing - Component */
import { NotFoundComponent } from './not-found/not-found.component';
import { SigninComponent } from './signin/signin.component';

const routes : Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
	{ path: 'signin', component: SigninComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
