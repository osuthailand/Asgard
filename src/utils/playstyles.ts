import { forIn } from "lodash";

export enum Playstyles {
    MOUSE = 1 << 0,
    KEYBOARD = 1 << 1,
    TABLET = 1 << 2,
    TOUCH = 1 << 3
}

export const getPlaystyles = (bitwise: Playstyles): string[] => {
    var playstyles: string[] = [];
    forIn(Playstyles, (key, value) => {
        if (isNaN(Number(key)) && Number(value) & bitwise) {
            playstyles.push((key as unknown as string).toLowerCase());
        }
    });
    return playstyles;
};