import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { TournamentManager } from "@app/shared/tournament-manager";
import { TournamentStatus } from "@app/models/tournament-status.model";
import { TournamentProgress } from "@app/models/tournament-progress.enum";

@Component({
  selector: "app-tournaments",
  templateUrl: "./tournaments.component.html",
  styleUrls: ["./tournaments.component.css"]
})
export class TournamentsComponent implements OnInit {
  TournamentProgress = TournamentProgress;
  statuses: TournamentStatus[];

  constructor(private api: ApiService) { }

  async ngOnInit() {
    const tournaments = await this.api.getTournaments();
    this.statuses = tournaments.map(TournamentManager.getStatus);
  }
}
