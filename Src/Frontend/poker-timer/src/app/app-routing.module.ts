import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "@app/login/login.component";
import { RegisterComponent } from "@app/register/register.component";
import { TournamentsComponent } from "@app/tournament/tournaments.component";
import { TournamentComponent } from "@app/tournament/tournament.component";
import { TournamentEditComponent } from "@app/tournament/tournament-edit.component";
import { SetupEditComponent } from "@app/setup/setup-edit.component";
import { SetupsComponent } from "@app/setup/setups.component";
import { SetupComponent } from "@app/setup/setup.component";
import { PageNotFoundComponent } from "@app/page-not-found/page-not-found.component";
import { AuthGuard } from "@app/shared/auth-guard.service";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "tournaments", component: TournamentsComponent, canActivate: [AuthGuard] },
  { path: "tournaments/create", component: TournamentEditComponent, canActivate: [AuthGuard] },
  { path: "tournaments/:id", component: TournamentComponent, canActivate: [AuthGuard] },
  { path: "tournaments/edit/:id", component: TournamentEditComponent, canActivate: [AuthGuard] },
  { path: "setups", component: SetupsComponent, canActivate: [AuthGuard] },
  { path: "setups/create", component: SetupEditComponent, canActivate: [AuthGuard] },
  { path: "setups/:id", component: SetupComponent, canActivate: [AuthGuard] },
  { path: "setups/edit/:id", component: SetupEditComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "/tournaments", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
