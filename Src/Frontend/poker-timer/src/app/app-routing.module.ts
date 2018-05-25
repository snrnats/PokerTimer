import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule} from "@angular/router";

import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import { TournamentsComponent } from "@app/tournament/tournaments.component";
import { TournamentComponent } from "@app/tournament/tournament.component";
import { TournamentEditComponent } from "@app/tournament/tournament-edit.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "tournaments", component: TournamentsComponent},
  {path: "tournament/create", component: TournamentEditComponent},
  {path: "tournament/:id", component: TournamentComponent},
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
})
export class AppRoutingModule { }
