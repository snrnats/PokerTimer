import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '@app/api.service';
import { Tournament } from '@app/models/tournament.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { TournamentManager } from '@app/shared/tournament-manager';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

  tournament: Tournament;
  levelProgress: number;  

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      let tournamentId = Number(params.get('id'));
      return this.api.getTournament(tournamentId);
    }).subscribe(res => this.tournament = res);
  }

  beginTournamentTracking(): void {
    let startDate = this.tournament.startDate;
    let endDate = TournamentManager.getEndDate(this.tournament);
    let now = new Date();
    if (now >= startDate && now <= endDate) {
      this.updateTournamentStatus();
    }
  }

  updateTournamentStatus():void {
    let levelIndex = TournamentManager.getCurrentLevel(this.tournament);
    

    setTimeout(this.updateTournamentStatus, 1000);
  }

  currentLevel(tournament: Tournament): string {
    let levelIndex = TournamentManager.getCurrentLevel(tournament);
    if (levelIndex === -1) {
      return "Tournament has not started yet"
    } else if (levelIndex === -2) {
      return "Tournament has finished"
    }
    return `On going: ${levelIndex + 1} level`;
  }

}
