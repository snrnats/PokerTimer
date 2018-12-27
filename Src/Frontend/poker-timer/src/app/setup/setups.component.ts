import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { ApiService } from "@app/api.service";
import { Tournament } from "@app/models/tournament.model";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { max, min, switchMap } from "rxjs/operators";
import { SetupLevel } from "@app/models/setup-level.model";
import { from, Observable, empty } from "rxjs";
import { MatTableDataSource, MatSort, Sort, MatTable, MatDialog } from "@angular/material";
import { ConfirmDialogComponent } from "@app/shared/confirm-dialog/confirm-dialog.component";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { SetupOwnerFilter } from "@app/api/setup-owner-filter";
import { query } from "@angular/animations";

@Component({
    selector: "app-setups",
    templateUrl: "./setups.component.html"
})
export class SetupsComponent implements OnInit {

    setups: TournamentSetup[];
    dataSource: MatTableDataSource<TournamentSetup>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<TournamentSetup>;
    displayedColumns = ["title", "startingChips", "numberOfPlayers", "levelDuration", "initialBlinds", "actions"];
    constructor(private api: ApiService, private cdr: ChangeDetectorRef, private dialog: MatDialog,
        private router: Router, private route: ActivatedRoute) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit() {
        this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
            const owner = params.get("owner");
            if (owner === null) {
                this.router.navigate(["."], { relativeTo: this.route, queryParams: { "owner": SetupOwnerFilter.Me } });
                return empty();
            } else {
                return this.api.getSetups(owner);
            }
        })).subscribe(res => {
            this.dataSource.data = res;
            const defaultAccessor = this.dataSource.sortingDataAccessor;
            this.dataSource.sortingDataAccessor = ((data: TournamentSetup, sortHeaderId: string) => {
                switch (sortHeaderId) {
                    case "levelDuration":
                        return Math.min(...data.levels.map(s => s.duration));
                    case "initialBlinds":
                        return data.levels && data.levels[0] ? data.levels[0].smallBlind : 0;
                    default:
                        return defaultAccessor(data, sortHeaderId);
                }
            });
            this.dataSource.sort = this.sort;
            this.setups = res;
        });
    }

    getLevelDuration(setup: TournamentSetup): string {
        const durations = setup.levels.map(s => s.duration);
        const maxDuration = Math.max(...durations);
        const minDuration = Math.min(...durations);
        if (minDuration !== maxDuration) {
            return `${minDuration} - ${maxDuration}`;
        } else {
            return String(minDuration);
        }
    }

    getBlinds(setup: TournamentSetup): string {
        if (setup.levels && setup.levels[0]) {
            const level = setup.levels[0];
            return `${level.smallBlind} ${level.bigBlind} ${level.ante}`;
        }
        return "";
    }

    openSetupDetails(setup: TournamentSetup): void {
        this.router.navigateByUrl(`/setups/${setup.id}`);
    }

    deleteSetup(setup: TournamentSetup) {
        const openedDialog = this.dialog.open(ConfirmDialogComponent, { data: { title: `Delete setup '${setup.title}'` } });
        openedDialog.afterClosed().subscribe(async isConfirmed => {
            if (isConfirmed) {
                await this.api.deleteSetup(setup.id);
                const index = this.dataSource.data.indexOf(setup);
                this.setups.splice(index, 1);
                this.dataSource.data = this.setups;
            }
        });
    }

    applyFilter(filterValue: string): void {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

}
