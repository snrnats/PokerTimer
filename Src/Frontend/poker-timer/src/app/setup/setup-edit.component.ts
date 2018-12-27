import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { ApiService } from "@app/api.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { SetupLevel } from "@app/models/setup-level.model";
import { MatTableDataSource, MatTableModule, MatTable } from "@angular/material";
import { CustomValidators } from "@app/shared/validators";
import { ImmediateErrorMatcher } from "@app/shared/immediate-error-matcher";

@Component({
  selector: "app-setup-edit",
  templateUrl: "./setup-edit.component.html",
  styleUrls: ["./setup-edit.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SetupEditComponent implements OnInit {
  setups: TournamentSetup[];
  immediateErrorMatchar: ImmediateErrorMatcher = new ImmediateErrorMatcher();

  displayedColumns = ["title", "smallBlind", "bigBlind", "ante", "duration", "actions"];
  dataSource: MatTableDataSource<TournamentSetup>;
  private id: number;
  form: FormGroup;
  levels: SetupLevel[];
  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  get levelForms(): FormArray {
    return this.form.get("levels") as FormArray;
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      if (params.has("id")) {
        const id = Number(params.get("id"));
        return this.api.getSetup(id);
      }
      return new Observable<TournamentSetup>(sub => sub.next({
        id: null,
        ownerId: null,
        title: null,
        startingChips: null,
        numberOfPlayers: null,
        isInfinite: false,
        infiniteMultiplier: null,
        levels: []
      }));
    })).subscribe(res => {
      this.id = res.id;

      this.form = this.fb.group({
        title: [res.title, [Validators.required]],
        startingChips: [res.startingChips, [Validators.required]],
        numberOfPlayers: [res.numberOfPlayers, [Validators.required]],
        isInfinite: [res.isInfinite, [Validators.required]],
        infiniteMultiplier: [res.infiniteMultiplier, []],
        levels: this.fb.array(res.levels.map(this.getLevelGroup, this), [Validators.required])
      });
      this.form.get("infiniteMultiplier").setValidators([CustomValidators.optionalValidation("isInfinite", (v) => v, Validators.required)]);
      this.levels = this.levelForms.value;
    });
  }

  getLevelGroup(level: SetupLevel): FormGroup {
    return this.fb.group({
      duration: [level.duration, [Validators.required, Validators.min(0)]],
      smallBlind: [level.smallBlind, [Validators.required, Validators.min(0)]],
      bigBlind: [level.bigBlind, [Validators.required, Validators.min(0)]],
      ante: [level.ante, [Validators.required, Validators.min(0)]],
    });
  }

  async submit(): Promise<void> {
    if (this.id !== null) {
      await this.api.updateSetup(Object.assign({ id: this.id }, this.form.value));
      this.router.navigateByUrl(`/setups/${this.id}`);
    } else {
      const res = await this.api.createSetup(this.form.value);
      this.router.navigateByUrl(`/setups/${res.id}`);
    }
  }

  addLevel(): void {
    this.levelForms.push(this.getLevelGroup({ duration: 0, smallBlind: 0, bigBlind: 0, ante: 0 }));
    this.levels = this.levelForms.value;
  }

  removeLevel(index: number) {
    this.levelForms.removeAt(index);
    this.levels = this.levelForms.value;
  }

}
