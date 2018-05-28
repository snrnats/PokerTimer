import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { TournamentManager } from "@app/shared/tournament-manager";
import { TournamentStatus } from "@app/models/tournament-status.model";

@Component({
  selector: "app-tournaments",
  templateUrl: "./tournaments.component.html",
  styleUrls: ["./tournaments.component.css"]
})
export class TournamentsComponent implements OnInit {
  statuses: TournamentStatus[];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.getTournaments().subscribe(res => {
      this.statuses = res.map(TournamentManager.getStatus);
    });
  }

}
