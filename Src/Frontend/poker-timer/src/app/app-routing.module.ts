import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component'
import {RegisterComponent} from './register/register.component'
import { TournamentsComponent } from '@app/tournaments/tournaments.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'tournaments', component: TournamentsComponent},
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
})
export class AppRoutingModule { }
