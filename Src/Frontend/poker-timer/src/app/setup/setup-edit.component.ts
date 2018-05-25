import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { ApiService } from "@app/api.service";

@Component({
  selector: "app-setup-edit",
  templateUrl: "./setup-edit.component.html",
  styleUrls: ["./setup-edit.component.css"]
})
export class SetupEditComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService) { }

  get levels(): FormArray {
    return this.form.get("levels") as FormArray;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ["", [Validators.required]],
      startingChips: ["", [Validators.required]],
      numberOfPlayers: ["", [Validators.required]],
      isInfinite: [false, [Validators.required]],
      levels: this.fb.array([
        this.getLevelGroup(),
        this.getLevelGroup()
      ])
    });
  }

  getLevelGroup(): FormGroup {
    return this.fb.group({
      duration: [1000, [Validators.required, Validators.min(0)]],
      smallBlind: [1000, [Validators.required, Validators.min(0)]],
      bigBlind: [1000, [Validators.required, Validators.min(0)]],
      ante: [0, [Validators.required, Validators.min(0)]],
    });
  }

  submit(): void {
    this.api.createSetup(this.form.value).subscribe(res => { console.log(res); });
  }

  onAdded(): void {
    this.levels.push(this.getLevelGroup());
  }

}
