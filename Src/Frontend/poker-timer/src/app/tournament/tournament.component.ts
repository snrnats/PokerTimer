import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '@app/api.service';
import { Tournament } from '@app/models/tournament.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { TournamentManager } from '@app/shared/tournament-manager';
import { SetupLevel } from '@app/models/setup-level.model';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  tournament: Tournament;
  levelProgress: number;
  tournamentStatus: string;
  levelTimeLeft: number;
  level: SetupLevel;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      let tournamentId = Number(params.get('id'));
      return this.api.getTournament(tournamentId);
    }).subscribe(res => {
      console.log(res);
      this.tournament = res;
      this.beginTournamentTracking();
    });
  }

  beginTournamentTracking(): void {
    let startDate = this.tournament.startDate;
    let endDate = TournamentManager.getEndDate(this.tournament);
    let now = new Date();
    this.updateTournamentStatusPeriodically();
  }

  updateTournamentStatus(): void {
    let status = TournamentManager.getTournamentStatus(this.tournament);

    this.tournamentStatus = status.info;
    this.levelProgress = status.levelProgress;
    this.levelTimeLeft = status.levelTimeLeft;
    this.level = status.levelIndex >= 0 ? this.tournament.setup.levels[status.levelIndex] : null;
  }

  updateTournamentStatusPeriodically(): void {
    console.log("updating tournament status");
    this.updateTournamentStatus();
    setTimeout(() => this.updateTournamentStatusPeriodically(), 1000);
  }

  onPaused():void {

  }

  onResumed():void {

  }

}
