import { SetupLevel } from "@app/models/setup-level.model";

export interface TournamentSetup {
    id: number;
    title: string;
    startingChips: number;
    numberOfPlayers: number;
    isInfinite: boolean;
    blindMultiplier: number;
    levels: SetupLevel[];
}
