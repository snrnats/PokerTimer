import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { TournamentManager } from "@app/shared/tournament-manager";
import { SetupLevel } from "@app/models/setup-level.model";
import { TournamentStatus } from "@app/models/tournament-status.model";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentComponent implements OnInit, OnDestroy {
  tournament: Tournament;
  status: TournamentStatus;
  isPaused = false;
  intervalHandle: any;

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      const tournamentId = Number(params.get("id"));
      return this.api.getTournament(tournamentId);
    })).subscribe(res => {
      console.log(res);
      this.tournament = res;
      this.beginTournamentTracking();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHandle);
  }

  beginTournamentTracking(): void {
    this.updateTournamentStatusPeriodically();
  }

  updateTournamentStatus(): void {
    this.status = TournamentManager.getStatus(this.tournament);
    this.cdr.detectChanges();
  }

  updateTournamentStatusPeriodically(): void {
    this.updateTournamentStatus();

    this.intervalHandle = setInterval(() => this.updateTournamentStatus(), 1000);
  }

  onPaused(): void {

  }

  onResumed(): void {

  }

  update(): void {
    this.updateTournamentStatus();
  }
}
