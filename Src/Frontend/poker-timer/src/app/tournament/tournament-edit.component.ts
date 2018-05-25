import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-tournament-edit",
  templateUrl: "./tournament-edit.component.html",
  styleUrls: ["./tournament-edit.component.css"]
})
export class TournamentEditComponent implements OnInit {

  form: FormGroup;
  private setups: TournamentSetup[];
  constructor(private fb: FormBuilder, private api: ApiService) {

    this.form = fb.group({
      title: ["", [Validators.required]],
      startDate: [new Date(), [Validators.required, Validators.minLength(6)]],
      setupId: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    this.api.getSetups().subscribe(res => this.setups = res);
  }

  submit(): void {
    this.api.createTournament(this.form.value).subscribe(res => console.log(res));
  }

}
