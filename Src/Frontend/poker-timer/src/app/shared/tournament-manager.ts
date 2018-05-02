import { Tournament } from "@app/models/tournament.model";
import { TournamentStatus } from "@app/shared/tournament-status";

export class TournamentManager {

    static getLevelEndDate(tournament: Tournament, levelIndex: number): Date {
        console.assert(levelIndex < tournament.setup.levels.length);

        let date = new Date(tournament.startDate);
        date.setSeconds(date.getSeconds() + tournament.pauseDuration);

        let endLevelIndex = Math.min(levelIndex, tournament.setup.levels.length - 1);
        for (let i = 0; i <= endLevelIndex; i++) {
            let level = tournament.setup.levels[i];
            date.setSeconds(date.getSeconds() + level.duration);
        }

        return date;
    }

    static getEndDate(tournament: Tournament): Date {
        return this.getLevelEndDate(tournament, tournament.setup.levels.length - 1);
    }

    static getCurrentLevel(tournament: Tournament): number {
        let now = new Date();

        let date = new Date(tournament.startDate);
        if (now < date) {
            return -1;
        }

        date.setSeconds(date.getSeconds() + tournament.pauseDuration);

        for (let i = 0; i < tournament.setup.levels.length; i++) {
            let level = tournament.setup.levels[i];
            date.setSeconds(date.getSeconds() + level.duration);
            if (now < date) {
                return i;
            }
        }

        return -2;
    }

    static getTournamentStatus(tournament: Tournament): TournamentStatus {
        let levelIndex = TournamentManager.getCurrentLevel(tournament);
        console.log(`level ${levelIndex}`);
        let status = new TournamentStatus();
        if (levelIndex === -1) {
            status.info = "Tournament has not started yet"
        } else if (levelIndex === -2) {
            status.info = "Tournament has finished"
        } else if (levelIndex >= 0) {
            status.info = `On going: ${levelIndex + 1} level`;

            let levelEndTime = TournamentManager.getLevelEndDate(tournament, levelIndex);
            let timeLeftSeconds = (levelEndTime.getTime() - new Date().getTime()) / 1000;

            status.levelIndex = levelIndex;
            status.levelTimeLeft = timeLeftSeconds;
            status.levelProgress = (1 - (timeLeftSeconds / tournament.setup.levels[levelIndex].duration)) * 100;
        }
        return status;
    }
}