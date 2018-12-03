import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { TournamentManager } from "@app/shared/tournament-manager";
import { SetupLevel } from "@app/models/setup-level.model";
import { TournamentStatus } from "@app/models/tournament-status.model";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { AuthService } from "@app/auth.service";

@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html"
})
export class SetupComponent implements OnInit {
  setup: TournamentSetup;
  canEdit: boolean;
  displayedColumns = ["title", "smallBlind", "bigBlind", "ante", "duration"];
  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef, private auth: AuthService) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const setupId = Number(params.get("id"));
          return this.api.getSetup(setupId);
        })
      )
      .subscribe(res => {
        this.setup = res;
        const userId = this.auth.getUserId();
        this.canEdit = userId === res.ownerId;
        this.canEdit = true;
      });
  }

  click() {
    const id = this.setup.id;
  }
}
