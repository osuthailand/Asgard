"use client";

import { Beatmap } from "@/types/beatmap";
import { getDifficultyColor } from "@/utils/beatmaps";
import { numToPlaymode } from "@/utils/modes";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";

export function VersionSelector(props: {
    beatmapSet: Beatmap[],
    selectedBeatmap: Beatmap,
}): JSX.Element {
    var sortedBeatmapSet = props.beatmapSet.sort((childMap1, childMap2) => childMap1.stars - childMap2.stars);
    return (
        <Dropdown placement="bottom-start" classNames={{
            content: "-md:w-[200px]"
        }}>
            <DropdownTrigger>
                <Button
                    variant="faded"
                    endContent={<FaAngleDown />}
                    className={
                        "-md:w-full -md:mr-4 w-[200px] h-auto justify-between px-4 h-8 " +
                        "data-[pressed=true]:scale-1 aria-expanded:scale-[1.0]"
                    }
                    disableAnimation
                >
                    <div className="flex items-center w-full gap-x-2">
                        <span
                            className={`osu-diff mode-${numToPlaymode(props.selectedBeatmap.mode)}`}
                            style={{
                                color: getDifficultyColor(props.selectedBeatmap.stars)
                            }}
                        />
                        <p className="truncate">{props.selectedBeatmap.version}</p>
                    </div>
                </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded">
                {sortedBeatmapSet.map(childMap => (
                    <DropdownItem
                        className={"py-0 h-8 " + (childMap.version == props.selectedBeatmap.version ? (
                            "bg-default-100 border-default"
                        ) : (
                            undefined
                        ))}
                        key={childMap.map_id}
                        as={Link}
                        href={`/beatmapsets/${childMap.set_id}/${childMap.map_id}`}
                    >
                        <div className="flex items-center w-full gap-x-2">
                            <span
                                className={`osu-diff mode-${numToPlaymode(childMap.mode)}`}
                                style={{
                                    color: getDifficultyColor(childMap.stars)
                                }}
                            />
                            {childMap.version}
                        </div>
                    </DropdownItem>
                ))
                }
            </DropdownMenu >
        </Dropdown >
    );
}