import { Component, OnInit } from "@angular/core";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { TournamentSetup } from "@app/models/tournament-setup.model";

@Component({
    selector: "app-setups",
    templateUrl: "./setups.component.html"
})
export class SetupsComponent implements OnInit {

    setups: TournamentSetup[];
    constructor(private api: ApiService) {
    }

    ngOnInit() {
        this.api.getSetups().subscribe(res => {
            this.setups = res;
        });
    }

}
