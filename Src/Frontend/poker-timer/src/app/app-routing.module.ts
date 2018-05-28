import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { TournamentsComponent } from "@app/tournament/tournaments.component";
import { TournamentComponent } from "@app/tournament/tournament.component";
import { TournamentEditComponent } from "@app/tournament/tournament-edit.component";
import { SetupEditComponent } from "@app/setup/setup-edit.component";
import { SetupsComponent } from "@app/setup/setups.component";
import { SetupComponent } from "@app/setup/setup.component";
import { PageNotFoundComponent } from "@app/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "tournaments", component: TournamentsComponent },
  { path: "tournaments/create", component: TournamentEditComponent },
  { path: "tournaments/:id", component: TournamentComponent },
  { path: "tournaments/edit/:id", component: TournamentEditComponent },
  { path: "setups", component: SetupsComponent },
  { path: "setups/create", component: SetupEditComponent },
  { path: "setups/:id", component: SetupComponent },
  { path: "setups/edit/:id", component: SetupEditComponent },
  { path: "",   redirectTo: "/tournaments", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
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
