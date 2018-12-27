import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { map, switchMap } from "rxjs/operators";
import { from, Observable, of, Subscriber } from "rxjs";
import { Tournament } from "@app/models/tournament.model";
import { SetupOwnerFilter } from "@app/api/setup-owner-filter";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-tournament-edit",
  templateUrl: "./tournament-edit.component.html",
  styleUrls: ["./tournament-edit.component.css"]
})
export class TournamentEditComponent implements OnInit {
  private id: number;
  form: FormGroup;
  setups: TournamentSetup[];
  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(async (params: ParamMap) => {
          if (params.has("id")) {
            const tournamentId = Number(params.get("id"));
            return this.api.getTournament(tournamentId);
          }
          const setupId = this.route.snapshot.queryParamMap.get("setupId");
          this.setups = await this.api.getSetups(SetupOwnerFilter.Me);

          let setup: TournamentSetup = null;
          if (setupId) {
            setup = await this.api.getSetup(Number(setupId));
            if (this.setups.every((s) => s.id !== setup.id)) {
              this.setups.push(setup);
            }
          }

          return <Tournament>{
            id: null,
            title: `Tournament at ${formatDate(new Date(), "mm:ss", "en")}`,
            setup: setup,
            startDate: new Date(),
            pauseDuration: null,
            isPaused: false,
            pauseStart: undefined
          };
        })
      )
      .subscribe((res: Tournament) => {
        this.id = res.id;
        this.form = this.fb.group({
          title: [res.title, [Validators.required]],
          startDate: [res.startDate, [Validators.required, Validators.minLength(6)]],
          setupId: [res.setup !== null ? res.setup.id : null, [Validators.required]]
        });
      });
  }

  async submit(): Promise<void> {
    if (this.id !== null) {
      await this.api.updateTournament(Object.assign({ id: this.id }, this.form.value));
      this.router.navigateByUrl(`/tournaments/${this.id}`);
    } else {
      const res = await this.api.createTournament(this.form.value);
      this.router.navigateByUrl(`/tournaments/${res.id}`);
    }
  }
}
