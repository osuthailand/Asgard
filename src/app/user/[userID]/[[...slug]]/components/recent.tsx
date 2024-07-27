"use client";

import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { FaRankingStar } from "react-icons/fa6";
import useSWR from "swr";

import TimeAgo from "react-timeago";
import { RecentActivities } from "@/types/activities";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function RecentActivity(props: {
    username: string;
    userID: number;
    playMode: number;
    gamemode: number;
}) {
    const { data, isLoading }: { data: RecentActivities[]; isLoading: boolean; } = useSWR(
        `https://api.rina.place/api/users/get/${props.userID}/activities?gamemode=${props.gamemode}&mode=${props.playMode}`,
        fetcher
    );

    return (
        <Card shadow="none" id="recent" radius="sm">
            <CardHeader className="bg-content3">
                <div className="flex items-center gap-4 text-xl">
                    <FaRankingStar height={32} width={32} />
                    recent
                </div>
            </CardHeader>
            <CardBody className="bg-content3/40 p-4">
                {isLoading ? <Spinner color="default" /> : (
                    <div className="flex flex-col gap-y-2">
                        {data?.length == 0 ? "This player haven't done anything notable in a while..." : (
                            data.map(act => (
                                <div key={act.id} className="flex justify-between">
                                    <span>
                                        <Link className="text-primary-700" href={"/user/" + props.userID}>
                                            {props.username}&nbsp;
                                        </Link>
                                        {act.activity}&nbsp;
                                        <Link
                                            className="text-primary-700"
                                            href={`/beatmapsets/${act.set_id}/${act.map_id}`}
                                        >
                                            {act.artist} - {act.title} ({act.version})&nbsp;
                                        </Link>
                                    </span>
                                    <TimeAgo date={act.timestamp * 1000} className="text-default-600" />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};