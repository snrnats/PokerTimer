import { Tournament } from "@app/models/tournament.model";

export class TournamentManager {

    static getLevelEndDate(tournament: Tournament, levelIndex: number): Date {
        console.assert(levelIndex < tournament.setup.levels.length);

        let date = tournament.startDate;
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

        let date = tournament.startDate;
        date.setSeconds(date.getSeconds() + tournament.pauseDuration);

        if (now < date) {
            return -1;
        }

        for (let i = 0; i < tournament.setup.levels.length; i++) {
            let level = tournament.setup.levels[i];
            date.setSeconds(date.getSeconds() + level.duration);
            if (now < date) {
                return i;
            }
        }

        return -2;
    }


}