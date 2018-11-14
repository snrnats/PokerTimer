import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { TournamentManager } from "@app/shared/tournament-manager";
import { SetupLevel } from "@app/models/setup-level.model";
import { TournamentStatus } from "@app/models/tournament-status.model";
import { TournamentProgress } from "@app/models/tournament-progress.enum";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"]
})
export class TournamentComponent implements OnInit, OnDestroy {
  TournamentProgress = TournamentProgress;
  tournament: Tournament;
  status: TournamentStatus;
  intervalHandle: any;

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const tournamentId = Number(params.get("id"));
          return this.api.getTournament(tournamentId);
        })
      )
      .subscribe(res => {
        this.tournament = res;
        if (!res.isPaused) {
          this.beginTournamentTracking();
        } else {
          this.updateTournamentStatus();
        }
      });
  }

  ngOnDestroy(): void {
    this.endTournamentTracking();
  }

  endTournamentTracking(): void {
    clearInterval(this.intervalHandle);
  }

  beginTournamentTracking(): void {
    console.log("begin update");
    this.updateTournamentStatus();
    console.log("begin update 2");
    this.intervalHandle = setInterval(() => this.updateTournamentStatus(), 1000);
  }

  updateTournamentStatus(): void {
    console.log("update");
    this.status = TournamentManager.getStatus(this.tournament);
    console.log("update 2");
    this.cdr.detectChanges();
    console.log("update 3");
  }

  async onPaused(): Promise<void> {
    this.tournament = await this.api.pauseTournament(this.tournament.id).toPromise();
    this.endTournamentTracking();
  }

  async onResumed(): Promise<void> {
    this.tournament = await this.api.resumeTournament(this.tournament.id).toPromise();
    this.beginTournamentTracking();
  }

  update(): void {
    this.updateTournamentStatus();
  }
}
