/* eslint-disable no-unused-vars */
import { Beatmap } from "@/types/beatmap";
import * as d3 from "d3";

export function getFullTitle(beatmap: Beatmap): String {
    return `${beatmap.artist} - ${beatmap.title} (${beatmap.version})`;
}

export function getApprovedString(approved: number): String {
    switch(approved) {
    case -2:
        return "Graveyard";
    case -1:
        return "WIP";
    case 0:
        return "Pending";
    case 2:
        return "Ranked";
    case 3:
        return "Approved";
    case 4:
        return "Qualified";
    case 5:
        return "Loved";
    default:
        return "Unknown";
    }
}

export function getApprovedStringFromBeatmap(beatmap: Beatmap): String {
    return getApprovedString(beatmap.approved);
}

// eslint-disable-next-line max-len
// https://github.com/ppy/osu-web/blob/ddf92c893b7771159a2c53c268ecae160ad8a73a/resources/js/utils/beatmap-helper.ts#L20-L24
const beatmapColorSpectrum = d3.scaleLinear<string>()
    .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range([
        "#4290FB", 
        "#4FC0FF", 
        "#4FFFD5", 
        "#7CFF4F",
        "#F6F05C", 
        "#FF8068", 
        "#FF4E6F", 
        "#C645B8", 
        "#6563DE", 
        "#18158E", 
        "#000000"
    ])
    .interpolate(d3.interpolateRgb.gamma(2.2));

export function getDifficultyColor(difficulty: number): string {
    if (difficulty < 0.1) return "#AAAAAA";
    if (difficulty >= 9) return "#000000";
    return beatmapColorSpectrum(difficulty);
};

export function readableDuration(duration: number): string {
    const minutes = duration / 60;
    const seconds = (minutes - Math.floor(minutes)) * 60;

    var response: string[] = [];

    response.push(Math.floor(minutes).toString());
    response.push(Math.floor(seconds).toString().padStart(2, "0"));

    return response.join(":");
}

export function shortTimeAgoLocale(number: number, index: number, totalSec: number | undefined): [string, string] {
    const s = [
        ["now", "now"],
        ["now", "now"],
        ["now", "now"],
        ["now", "now"],
        ["1h", "in 1h"],
        ["%sh", "in %sh"],
        ["1d", "in 1d"],
        ["%sd", "in %sd"],
        ["1w", "in 1w"],
        ["%sw", "in %sw"],
        ["1m", "in 1m"],
        ["%sm", "in %sm"],
        ["1y", "in 1y"],
        ["%sy", "in %sy"]
    ][index];
    return (s as [string, string]);
}

