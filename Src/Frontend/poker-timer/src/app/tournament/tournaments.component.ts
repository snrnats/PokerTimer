import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/api.service';
import { Tournament } from '@app/models/tournament.model';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {

  tournaments: Tournament[];
  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.getTournaments().subscribe(res => {
      this.tournaments = res;
    });
  }

}
