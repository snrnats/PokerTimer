import { Tournament } from "@app/models/tournament.model";
import { SetupLevel } from "@app/models/setup-level.model";
import { TournamentProgress } from "@app/models/tournament-progress.enum";

export class TournamentStatus {
    constructor(tournament: Tournament, progress: TournamentProgress, levelIndex?: number, level?: SetupLevel,
        levelEndTime?: Date, levelTimeLeft?: number, levelProgress?: number) {
        this.tournament = tournament;
        this.levelIndex = levelIndex;
        this.level = level;
        this.progress = progress;
        this.levelEndTime = levelEndTime;
        this.levelTimeLeft = levelTimeLeft;
        this.levelProgress = levelProgress;
    }

    readonly tournament: Tournament;
    readonly levelIndex: number;
    readonly level: SetupLevel;
    readonly progress: TournamentProgress;
    readonly levelEndTime: Date;
    readonly levelTimeLeft: number;
    readonly levelProgress: number;
}
