import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule} from "@angular/router";

import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import { TournamentsComponent } from "@app/tournament/tournaments.component";
import { TournamentComponent } from "@app/tournament/tournament.component";
import { TournamentEditComponent } from "@app/tournament/tournament-edit.component";
import { SetupEditComponent } from "@app/setup/setup-edit.component";
import { SetupsComponent } from "@app/setup/setups.component";
import { SetupComponent } from "@app/setup/setup.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "tournaments", component: TournamentsComponent},
  {path: "tournament/create", component: TournamentEditComponent},
  {path: "tournament/:id", component: TournamentComponent},
  {path: "setups", component: SetupsComponent},
  {path: "setup/create", component: SetupEditComponent},
  {path: "setup/:id", component: SetupComponent},
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
