import { Tournament } from "@app/models/tournament.model";
import { TournamentStatus } from "@app/models/tournament-status.model";
import { TournamentProgress } from "@app/models/tournament-progress.enum";

export class TournamentManager {
    private static getLevelEndDate(tournament: Tournament, levelIndex: number): Date {
        console.assert(levelIndex < tournament.setup.levels.length);

        const date = new Date(tournament.startDate);
        date.setSeconds(date.getSeconds() + tournament.pauseDuration);

        const endLevelIndex = Math.min(levelIndex, tournament.setup.levels.length - 1);
        for (let i = 0; i <= endLevelIndex; i++) {
            const level = tournament.setup.levels[i];
            date.setSeconds(date.getSeconds() + level.duration);
        }

        return date;
    }

    private static getEndDate(tournament: Tournament): Date {
        return this.getLevelEndDate(tournament, tournament.setup.levels.length - 1);
    }

    private static getCurrentLevel(tournament: Tournament): number {
        const now = new Date();

        const date = new Date(tournament.startDate);
        if (now < date) {
            return -1;
        }

        date.setSeconds(date.getSeconds() + tournament.pauseDuration);

        for (let i = 0; i < tournament.setup.levels.length; i++) {
            const level = tournament.setup.levels[i];
            date.setSeconds(date.getSeconds() + level.duration);
            if (now < date) {
                return i;
            }
        }

        return -2;
    }

    private static getLevelTimeLeft(levelEndTime): number {
        return (levelEndTime.getTime() - new Date().getTime()) / 1000;
    }

    private static getLevelProgress(levelTimeLeft: number, levelIndex: number, tournament: Tournament): number {
        return (1 - (levelTimeLeft / tournament.setup.levels[levelIndex].duration)) * 100;
    }

    static getStatus(tournament: Tournament): TournamentStatus {
        let status: TournamentStatus;
        const levelIndex = TournamentManager.getCurrentLevel(tournament);
        if (levelIndex === -1) {
            const progress = TournamentProgress.NotStarted;
            status = new TournamentStatus(progress);
        } else if (levelIndex === -2) {
            const progress = TournamentProgress.Finished;
            status = new TournamentStatus(progress);
        } else if (levelIndex >= 0) {
            const progress = TournamentProgress.OnGoing;
            const levelEndTime = TournamentManager.getLevelEndDate(tournament, levelIndex);
            const levelTimeLeft = TournamentManager.getLevelTimeLeft(levelEndTime);
            const levelProgress = TournamentManager.getLevelProgress(levelTimeLeft, levelIndex, tournament);
            status = new TournamentStatus(progress, levelIndex, tournament.setup.levels[levelIndex],
                levelEndTime, levelTimeLeft, levelProgress);
        }
        return status;
    }
}
