/* eslint-disable indent */
export function playModeToNum(playmode: string): number {
    switch (playmode) {
        case "osu":
            return 0;
        case "taiko":
            return 1;
        case "catch":
            return 2;
        case "mania":
            return 3;
        default:
            throw new Error("invalid playmode");
    }
}

export function gamemodeToNum(gamemode: string): number {
    switch (gamemode) {
        case "vanilla":
            return 0;
        case "relax":
            return 1;
        default:
            throw new Error("invalid gamemode");
    }
}

export function numToPlaymode(playmode: number): string {
    switch (playmode) {
        case 0:
            return "osu";
        case 1:
            return "taiko";
        case 2:
            return "catch";
        case 3:
            return "mania";
        default:
            throw new Error("invalid playmode");
    }
}

export function numToGamemode(gamemode: number): string {
    switch (gamemode) {
        case 0:
            return "vanilla";
        case 1:
            return "relax";
        default:
            throw new Error("invalid gamemode");
    }
}
