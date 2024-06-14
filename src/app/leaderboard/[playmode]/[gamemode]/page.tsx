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
        className={props.slug != props.activeState ? "text-white" : ""}
        size="sm"
        variant={props.slug == props.activeState ? "solid" : "light"}
    >
        {props.title}
    </Button>;
}

function playmode_number(playmode: string): number {
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

function gamemode_number(gamemode: string): number {
    switch (gamemode) {
        case "vanilla":
            return 0;
        case "relax":
            return 1;
        default:
            throw new Error("invalid gamemode");
    }
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Leaderboard({
    params
}: {
    params: { playmode: string, gamemode: string; };
}) {
    const [page, setPage] = useState(1);
    const playmode = playmode_number(params.playmode);
    const gamemode = gamemode_number(params.gamemode);

    const { data, isLoading } = useSWR(
        `https://api.rina.place/api/v1/community/leaderboard?mode=${playmode}&gamemode=${gamemode}&page=${page}`,
        fetcher,
        {
            keepPreviousData: true,
        });
    const rowsPerPage = 50;

    const pages = useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
    }, [data?.count, rowsPerPage]);

    return (
        <div className="max-w-[1127px] mx-auto">
            <Card isFooterBlurred className="max-h-[250px] rounded-b-none rounded-t-md">
                <CardHeader className="absolute z-10 top-1 bottom-1 px-8 py-14">
                    <p className="text-[48px] text-white">Leaderboard</p>
                </CardHeader>
                <Image
                    height={250}
                    width={1127}
                    alt="Leaderboard banner"
                    className="z-0 w-full object-cover rounded-b-none rounded-t-md"
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
            >
                <TableHeader>
                    <TableColumn>{""}</TableColumn>
                    <TableColumn className="w-full">Username</TableColumn>
                    <TableColumn className="font-semibold w-0">Performance points</TableColumn>
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
                            <TableCell>#{item.rank}</TableCell>
                            <TableCell className="flex flex-grow gap-2 items-center ">
                                <span className={"flag flag-country-" + item.country.toLowerCase()} />
                                <Link className="hover:underline" href={"/user/" + item.id}>{item.username}</Link>
                            </TableCell>
                            <TableCell className="font-semibold mx-4">{item.pp}pp</TableCell>
                            <TableCell className="text-default-500 mx-4">{item.accuracy}%</TableCell>
                            <TableCell className="text-default-500 mx-4">{item.playcount}</TableCell>
                            <TableCell className="text-default-500">{item.level}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}