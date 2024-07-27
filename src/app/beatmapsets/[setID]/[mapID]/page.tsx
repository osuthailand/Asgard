import Container from "@/app/components/container";
import { getApprovedStringFromBeatmap, getDifficultyColor, getFullTitle, readableDuration } from "@/utils/beatmaps";
import { format } from "timeago.js";
import Image from "next/image";
import { Button, Chip } from "@nextui-org/react";
import Link from "next/link";
import { FaDownload } from "react-icons/fa6";
import { Beatmap } from "@/types/beatmap";
import { BeatmapLeaderboard } from "./components/leaderboard";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { VersionSelector } from "./components/version";

export default async function BeatmapPage({
    params
}: {
    params: { setID: number, mapID: number; };
}) {
    const session = await getServerSession(options);
    const response = await fetch(
        `https://api.rina.place/api/beatmap/set/${params.setID}`
    );
    const beatmapSet: Beatmap[] = await response.json();

    if (!beatmapSet || "error" in beatmapSet || "detail" in beatmapSet) {
        throw Error("beatmap not found");
    }

    const mapInfo = beatmapSet.find((beatmap: Beatmap) => beatmap.map_id == params.mapID);

    if (!mapInfo) {
        throw Error("beatmap not found");
    }

    return (
        <>
            <Container>
                <div className="w-full">
                    <div className="w-full bg-content1 rounded-t-lg">
                        <div className="flex justify-between px-8 py-2">
                            <VersionSelector beatmapSet={beatmapSet} selectedBeatmap={mapInfo} />
                            <Chip
                                radius="sm"
                                size="lg"
                                variant="faded"
                                classNames={{
                                    base: "rounded-medium",
                                    content: "dont-be-font-medium text-small"
                                }}
                            >
                                {getApprovedStringFromBeatmap(mapInfo)}
                            </Chip>
                        </div>
                    </div>
                    <Image
                        height={200}
                        width={1127}
                        alt={`${getFullTitle(mapInfo)}'s cover image`}
                        src={`https://assets.ppy.sh/beatmaps/${mapInfo.set_id}/covers/cover.jpg`}
                        className="w-full object-cover h-[200px]"
                    />
                </div>
                <div className="bg-content1 rounded-b-md">
                    <div className="md:px-12 md:py-4 -md:block flex justify-between items-center">
                        <div className="-md:px-8 -md:py-4 flex flex-col -md:items-center">
                            <div className="-md:text-center">
                                <span className="text-xl leading-none">{mapInfo.title}</span>
                                <span className="text-md">&nbsp;by {mapInfo.artist}</span>
                                <p className="text-xl font-bold leading-none" style={{
                                    color: getDifficultyColor(mapInfo.stars)
                                }}>
                                    {mapInfo.version}
                                </p>
                            </div>
                            <div className="flex items-center mt-3">
                                <Image
                                    alt={"Creator's avatar"}
                                    height={48}
                                    width={48}
                                    className="rounded-medium mr-2"
                                    src={"https://a.ppy.sh/" + mapInfo.creator_id}
                                />
                                <div className="items-center text-sm">
                                    <p className="text-default-500">
                                        mapped by&nbsp;
                                        <Link
                                            className="text-white"
                                            href={"https://osu.ppy.sh/users/" + mapInfo.creator_id}
                                        >
                                            {mapInfo.creator}
                                        </Link>
                                    </p>
                                    <p className="text-default-500">
                                        submitted&nbsp;
                                        <span className="text-primary-700">{format(mapInfo.submit_date)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-x-2">
                                <Button
                                    as={Link}
                                    className="px-5 h-9 rounded-full bg-blue-400/60 shadow-md hover:bg-blue-400/90"
                                    href=""
                                    endContent={<FaDownload />}
                                >
                                    download
                                </Button>
                                <Button
                                    as={Link}
                                    className="px-5 h-9 rounded-full bg-blue-400/60 shadow-md hover:bg-blue-400/90"
                                    href="osu://..."
                                    endContent={<FaDownload />}
                                >
                                    osu!direct
                                </Button>
                            </div>
                        </div>
                        <div className="-md:px-8 -md:py-4 md:min-w-[400px] -md:mt-4 -md:bg-content2/70">
                            <div className="flex justify-between">
                                <div className="text-center">
                                    <p className="text-primary-700 text-lg font-bold">
                                        {readableDuration(mapInfo.hit_length)}
                                    </p>
                                    <p className="leading-none text-sm text-default-600">length</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-700 text-lg font-bold">{mapInfo.bpm}</p>
                                    <p className="leading-none text-sm text-default-600">bpm</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-700 text-lg font-bold">0</p>
                                    <p className="leading-none text-sm text-default-600">circles</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-700 text-lg font-bold">0</p>
                                    <p className="leading-none text-sm text-default-600">sliders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-700 text-lg font-bold">0</p>
                                    <p className="leading-none text-sm text-default-600">spinners</p>
                                </div>
                            </div>
                            <table className="w-full mt-4 leaderboard">
                                <tbody className="text-small font-normal text-left">
                                    <tr>
                                        <th className="min-w-[8rem] font-normal text-default-600">Star Difficulty</th>
                                        <td className="text-[#fc2] text-center">
                                            {mapInfo.stars.toFixed(2)}
                                        </td>
                                        <td className="w-full pl-4">
                                            <div className="bg-default-300 h-1.5 w-full rounded-full relative">
                                                <div
                                                    className="bg-[#fc2] h-1.5 rounded-full absolute"
                                                    style={{
                                                        width: Math.min(mapInfo.stars * 10.0, 100.0) + "%"
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="min-w-[8rem] font-normal text-default-600">Circle Size</th>
                                        <td className="text-primary-700 text-center">
                                            {mapInfo.cs.toFixed(1)}
                                        </td>
                                        <td className="w-full pl-4">
                                            <div className="bg-default-300 h-1.5 w-full rounded-full relative">
                                                <div
                                                    className="bg-primary-700 h-1.5 rounded-full absolute"
                                                    style={{
                                                        width: Math.min(mapInfo.cs * 10.0, 100.0) + "%"
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="min-w-[8rem] font-normal text-default-600">Approach rate</th>
                                        <td className="text-primary-700 text-center">
                                            {mapInfo.ar.toFixed(1)}
                                        </td>
                                        <td className="w-full pl-4">
                                            <div className="bg-default-300 h-1.5 w-full rounded-full relative">
                                                <div
                                                    className="bg-primary-700 h-1.5 rounded-full absolute"
                                                    style={{
                                                        width: Math.min(mapInfo.ar * 10.0, 100.0) + "%"
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="min-w-[8rem] font-normal text-default-600">HP Drain</th>
                                        <td className="text-primary-700 text-center">
                                            {mapInfo.hp.toFixed(1)}
                                        </td>
                                        <td className="w-full pl-4">
                                            <div className="bg-default-300 h-1.5 w-full rounded-full relative">
                                                <div
                                                    className="bg-primary-700 h-1.5 rounded-full absolute"
                                                    style={{
                                                        width: Math.min(mapInfo.hp * 10.0, 100.0) + "%"
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="min-w-[8rem] font-normal text-default-600">
                                            Overall Difficulty
                                        </th>
                                        <td className="text-primary-700 text-center">
                                            {mapInfo.od.toFixed(1)}
                                        </td>
                                        <td className="w-full pl-4">
                                            <div className="bg-default-300 h-1.5 w-full rounded-full relative">
                                                <div
                                                    className="bg-primary-700 h-1.5 rounded-full absolute"
                                                    style={{
                                                        width: Math.min(mapInfo.od * 10.0, 100.0) + "%"
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Container>
            <Container>
                <div className="bg-content2 w-full rounded-md">
                    <BeatmapLeaderboard mapInfo={mapInfo} session={session} />
                </div>
            </Container>
        </>
    );
}