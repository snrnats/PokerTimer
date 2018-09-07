import { TournamentSetup } from "@app/models/tournament-setup.model";

export interface Tournament {
    id: number;
    title: string;
    setup: TournamentSetup;
    startDate: Date;
    pauseDuration: number;
    isPaused: boolean;
}
