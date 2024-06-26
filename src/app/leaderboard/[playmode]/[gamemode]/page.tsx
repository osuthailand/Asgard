"use client";

import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import useSWR from "swr";

import LeaderboardBanner from "../../../../../public/images/leaderboard-banner.jpg";
import { gamemodeToNum, playModeToNum } from "@/utils/modes";

type LeaderboardButtonProps = {
    slug: string,
    activeState: string,
    title: string,
    href: string,
    isDisabled?: boolean;
};

function LeaderboardButton(props: LeaderboardButtonProps) {
    return <Button
        as={Link}
        href={props.href}
        radius="md"
        isDisabled={props.isDisabled}
        className={"bg-content2" + (props.slug != props.activeState ? "text-white" : "")}
        size="sm"
        variant={props.slug == props.activeState ? "solid" : "light"}
    >
        {props.title}
    </Button>;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Leaderboard({
    params
}: {
    params: { playmode: string, gamemode: string; };
}) {
    const [page, setPage] = useState(1);
    const playmode = playModeToNum(params.playmode);
    const gamemode = gamemodeToNum(params.gamemode);

    const { data, isLoading } = useSWR(
        `https://api.rina.place/api/community/leaderboard?mode=${playmode}&gamemode=${gamemode}&page=${page}`,
        fetcher,
        {
            keepPreviousData: true,
        });
    const rowsPerPage = 50;

    const pages = useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
    }, [data?.count, rowsPerPage]);

    return (
        <div className="max-w-[1127px] mx-auto container-shadow">
            <Card isFooterBlurred className="max-h-[250px] rounded-b-none rounded-t-md">
                <CardHeader className="absolute z-10 top-1 bottom-1 px-8 py-14">
                    <p className="text-[48px] text-white">Leaderboard</p>
                </CardHeader>
                <Image
                    height={250}
                    width={1127}
                    alt="Leaderboard banner"
                    className="z-0 w-full object-cover rounded-b-none rounded-t-md brightness-50"
                    src={LeaderboardBanner}

                />
                <CardFooter className="rounded-b-none absolute bottom-0 z-10 px-8">
                    <div className="flex flex-grow justify-between items-center">
                        <div className="flex flex-grow gap-2">
                            <LeaderboardButton
                                href={"/leaderboard/" + params.playmode + "/vanilla"}
                                slug={params.gamemode}
                                activeState="vanilla"
                                title="vanilla" />
                            <LeaderboardButton
                                href={"/leaderboard/" + params.playmode + "/relax"}
                                slug={params.gamemode}
                                activeState="relax"
                                title="relax" />
                        </div>
                        <div className="flex gap-2">
                            <LeaderboardButton
                                href={"/leaderboard/osu/" + params.gamemode}
                                slug={params.playmode}
                                activeState="osu"
                                title="osu!" />
                            <LeaderboardButton
                                href={"/leaderboard/taiko/" + params.gamemode}
                                slug={params.playmode}
                                activeState="taiko"
                                title="osu!taiko" />
                            <LeaderboardButton
                                href={"/leaderboard/catch/" + params.gamemode}
                                slug={params.playmode}
                                activeState="catch"
                                title="osu!catch" />
                            <LeaderboardButton
                                href={"/leaderboard/mania/" + params.gamemode}
                                isDisabled={params.gamemode == "relax"}
                                slug={params.playmode}
                                activeState="mania"
                                title="osu!mania" />
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <Table
                topContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                showControls
                                variant="bordered"
                                key="bordered"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                showControls
                                variant="bordered"
                                key="bordered"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                classNames={{
                    table: "leaderboard",
                    tr: "rounded-md bg-content2/70 hover:bg-content2",
                    th: "bg-content1"
                }}
            >
                <TableHeader>
                    <TableColumn>{""}</TableColumn>
                    <TableColumn className="w-full">{""}</TableColumn>
                    <TableColumn className="text-default-600 font-semibold w-0">Performance points</TableColumn>
                    <TableColumn className="text-default-400 w-0">Accuracy</TableColumn>
                    <TableColumn className="text-default-400 w-0">Play count</TableColumn>
                    <TableColumn className="text-default-400 w-0">Level</TableColumn>
                </TableHeader>
                <TableBody
                    items={data?.users ?? []}
                    isLoading={isLoading}
                    loadingContent={"Loading..."}
                    emptyContent={"No rows to display."}
                >
                    {(item: {
                        id: number,
                        username: string,
                        rank: number,
                        country: string,
                        pp: number,
                        accuracy: number,
                        playcount: number,
                        level: number,
                    }) => (
                        <TableRow key={item.username}>
                            <TableCell className="bg-content3/50 rounded-l-md text-center">#{item.rank}</TableCell>
                            <TableCell className="flex flex-grow gap-2 items-center ">
                                <span className={"flag flag-country-" + item.country.toLowerCase()} />
                                <Link className="hover:underline" href={"/user/" + item.id}>{item.username}</Link>
                            </TableCell>
                            <TableCell className="font-semibold mx-4">{parseFloat(item.pp.toFixed(0)).toLocaleString()}pp</TableCell>
                            <TableCell className="text-default-500 mx-4">{item.accuracy.toFixed(0).toLocaleString()}%</TableCell>
                            <TableCell className="text-default-500 mx-4">{item.playcount.toLocaleString()}</TableCell>
                            <TableCell className="text-default-500 rounded-r-md">{item.level}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    );
}