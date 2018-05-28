import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Observable, Subscriber } from "rxjs";
import { Tournament } from "@app/models/tournament.model";

@Component({
  selector: "app-tournament-edit",
  templateUrl: "./tournament-edit.component.html",
  styleUrls: ["./tournament-edit.component.css"]
})
export class TournamentEditComponent implements OnInit {

  private id: number;
  form: FormGroup;
  setups: TournamentSetup[];
  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      if (params.has("id")) {
        const tournamentId = Number(params.get("id"));
        return this.api.getTournament(tournamentId);
      }
      return new Observable<Tournament>(sub => sub.next({
        id: null,
        title: null,
        setup: null,
        startDate: new Date(),
        pauseDuration: null,
        isPaused: false
      }));
    })).subscribe((res: Tournament) => {
      this.id = res.id;
      this.form = this.fb.group({
        title: [res.title, [Validators.required]],
        startDate: [res.startDate, [Validators.required, Validators.minLength(6)]],
        setupId: [res.setup !== null ? res.setup.id : null, [Validators.required]]
      });
    });
    this.api.getSetups().subscribe(res => this.setups = res);
  }

  submit(): void {
    if (this.id !== null) {
      this.api.updateTournament(Object.assign({ id: this.id }, this.form.value)).subscribe(res => {
        this.router.navigateByUrl(`/tournaments/${this.id}`)
      });
    } else {
      this.api.createTournament(this.form.value).subscribe(res => {
        this.router.navigateByUrl(`/tournaments/${res.id}`);
      });
    }
  }
}
