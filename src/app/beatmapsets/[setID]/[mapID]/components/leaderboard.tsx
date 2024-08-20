/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Beatmap } from "@/types/beatmap";
import { shortTimeAgoLocale } from "@/utils/beatmaps";
import { fetchWithSession } from "@/utils/fetching";
import { gamemodes, playModes } from "@/utils/modes";
import { getModCombinationNames } from "@/utils/mods";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format, register } from "timeago.js";

const typeOfs = [
    {
        title: "overall",
        requiresSession: false,
    },
    {
        title: "friends",
        requiresSession: true,
    },
    {
        title: "country",
        requiresSession: true,
    },
    {
        title: "local",
        requiresSession: true,
    }
];

export function BeatmapLeaderboard(props: {
    mapInfo: Beatmap,
    session: Session | null;
}): JSX.Element {
    const [typeOf, setTypeOf] = useState("overall");
    const [playMode, setPlayMode] = useState(props.mapInfo.mode);
    const [gamemode, setGamemode] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const populateLeaderboard = async () => {
            setIsLoading(true);
            setData([]);

            const response = await fetchWithSession(
                `https://api.rina.place/api/beatmap/scores/${props.mapInfo.map_id}?` +
                new URLSearchParams({
                    mode: playMode.toString(),
                    gamemode: gamemode.toString(),
                    typeof: typeOf
                }).toString(),
                props.session
            );

            const scores = await response.json();

            if ("error" in scores || "details" in scores) {
                setData([]);
            } else {
                setData(scores);
            }

            setIsLoading(false);
        };

        populateLeaderboard()
            .catch(console.error);
    }, [playMode, gamemode, typeOf, props.mapInfo]);

    register("short-locale", shortTimeAgoLocale);

    return (
        <>
            <div className="py-2 w-full px-12 bg-content1/60 flex justify-between rounded-t-md">
                <div className="flex gap-x-2">
                    {gamemodes.map(gm => (
                        <Button
                            variant="faded"
                            className={
                                "-md:w-full h-auto text-center px-4 h-8 hover:text-white " +
                                (gm.numeric !== gamemode ? "text-default-500" : "")
                            }
                            disableAnimation
                            key={gm.numeric}
                            onClick={() => setGamemode(gm.numeric)}
                            isDisabled={gm.numeric == 1 && playMode == 3}
                        >
                            {gm.title}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-x-2">
                    {playModes.map(pm => (
                        <Button
                            variant="faded"
                            className={
                                "-md:w-full h-auto text-center px-4 h-8 hover:text-white " +
                                (pm.numeric !== playMode ? "text-default-500" : "")
                            }
                            disableAnimation
                            key={pm.numeric}
                            onClick={() => setPlayMode(pm.numeric)}
                            isIconOnly
                            isDisabled={
                                (pm.numeric === 3 && gamemode == 1) ||
                                (props.mapInfo.mode !== 0 && pm.numeric !== props.mapInfo.mode)
                            }
                        >
                            <span className={pm.icon}></span>
                        </Button>
                    ))}

                </div>
            </div>
            <div className="py-2 w-full">
                <div className="flex gap-x-12 w-full justify-center">
                    {typeOfs.map(typ => (
                        <a
                            key={typ.title}
                            className={
                                "relative hover:text-white " +
                                (typeOf !== typ.title ? (
                                    "text-default-600 "
                                ) : "") +
                                (props.session === null && typ.requiresSession ? (
                                    "opacity-10 "
                                ) : "")
                            }
                            onClick={
                                () => (props.session !== null && typ.requiresSession) || !typ.requiresSession ? (
                                    setTypeOf(typ.title)
                                ) : undefined
                            }
                        >
                            {typ.title}
                            {typeOf == typ.title ? (
                                <span className="h-[3px] mt-[30px] bg-primary-600 left-0 w-full absolute"></span>
                            ) : null}
                        </a>
                    ))}
                </div>
            </div>
            <Table
                classNames={{
                    wrapper: "bg-content1/60",
                    table: "leaderboard px-4 rounded-b-md",
                    th: "h-4 text-default-500 bg-[unset]"
                }}
                shadow="none"
                radius="none"
                isStriped
            >
                <TableHeader>
                    <TableColumn>{"Rank"}</TableColumn>
                    <TableColumn className="w-0">{""}</TableColumn>
                    <TableColumn className={gamemode == 0 ? "text-default-700 " : "" + "w-[100px]"}>
                        Score
                    </TableColumn>
                    <TableColumn className="w-[100px]">Accuracy</TableColumn>
                    <TableColumn className="w-0">{""}</TableColumn>
                    <TableColumn className="w-[180px]">Player</TableColumn>
                    <TableColumn className={gamemode == 1 ? "text-default-700 " : "" + "w-0"}>PP</TableColumn>
                    <TableColumn className="w-[120px]">Max combo</TableColumn>
                    <TableColumn className="w-[70px]">300</TableColumn>
                    <TableColumn className="w-[70px]">100</TableColumn>
                    <TableColumn className="w-[70px]">50</TableColumn>
                    <TableColumn className="w-[70px]">Miss</TableColumn>
                    <TableColumn className="w-[120px]">Mods</TableColumn>
                    <TableColumn className="w-0">{""}</TableColumn>
                </TableHeader>
                <TableBody
                    items={data ?? []}
                    isLoading={isLoading}
                    loadingContent={"Loading..."}
                >
                    {data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="rounded-l-md">#{index + 1}</TableCell>
                            <TableCell className="font-bold">{item.rank}</TableCell>
                            <TableCell>{item.score.toLocaleString("en-US")}</TableCell>
                            <TableCell>{item.accuracy.toFixed(2)}%</TableCell>
                            <TableCell>
                                <span className={"flag flag-country-" + item.country.toLowerCase()} />
                            </TableCell>
                            <TableCell>
                                <Link href={`/user/${item.user_id}`} className="hover:underline">
                                    {item.username}
                                </Link>
                            </TableCell>
                            <TableCell className="font-bold">{item.pp.toFixed(0)}</TableCell>
                            <TableCell
                                className={
                                    item.max_combo === props.mapInfo.max_combo ? "text-green-400 font-semibold" : ""
                                }
                            >
                                {item.max_combo}x
                            </TableCell>
                            <TableCell className={item.count_300 == 0 ? "text-default-500" : ""}>
                                {item.count_300}
                            </TableCell>
                            <TableCell className={item.count_100 == 0 ? "text-default-500" : ""}>
                                {item.count_100}
                            </TableCell>
                            <TableCell className={item.count_50 == 0 ? "text-default-500" : ""}>
                                {item.count_50}
                            </TableCell>
                            <TableCell className={item.count_miss == 0 ? "text-default-500" : ""}>
                                {item.count_miss}
                            </TableCell>
                            <TableCell>{getModCombinationNames(item.mods)}</TableCell>
                            <TableCell className="rounded-r-md">
                                {format(item.submitted * 1000, "short-locale")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}