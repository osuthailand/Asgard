"use client";

import { Card, CardBody, CardHeader, Chip, Divider, Spinner, Tooltip } from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { UserProfileData } from "@/types/profile";
import { ApexOptions } from "apexcharts";

import useSWR from "swr";
import { getPlaystyles } from "@/utils/playstyles";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

TimeAgo.addDefaultLocale(en);

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function UserStats(props: {
    userInfo: UserProfileData;
    gamemode: number;
    playMode: number;
}) {
    const { data, isLoading } = useSWR(
        `https://api.rina.place/api/users/get/${props.userInfo.id}/stats?gamemode=${props.gamemode}&mode=${props.playMode}`,
        fetcher
    );

    const timeAgo = new TimeAgo("en-US");
    const joinedDate = new Date(props.userInfo.registered_time * 1000);
    const lastSeenDate = new Date(props.userInfo.latest_activity_time * 1000);

    const options: ApexOptions = {
        chart: {
            type: "line",
            height: 200,
            animations: {
                enabled: false
            },
            foreColor: "text-default-800",
            width: "100%",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        noData: {
            text: "No profile history of user :(",
            style: {
                fontSize: "1rem",
                color: "hsl(240 4.88% 83.92%)"
            }
        },
        grid: {
            show: false
        },
        yaxis: {
            show: false
        },
        title: {
            text: `Performance points`,
            align: "left",
            style: {
                fontFamily: "Exo 2",
                color: "#fff",
                fontSize: "16",
                fontWeight: 500
            }
        },
        subtitle: {
            text: isLoading ? "loading" : `${data?.pp.toLocaleString("en-US")}pp`,
            align: "left",
            offsetY: 15,
            style: {
                fontFamily: "Exo 2",
                color: "hsl(240 4.88% 83.92%)",
                fontSize: "24"

            }
        },
        xaxis: {
            tooltip: {
                enabled: false
            },
            labels: {
                show: false
            },
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            },
            crosshairs: {
                show: false
            }
        },
        stroke: {
            width: 3,
            curve: "straight",
        },
        markers: {
            size: 0,
        },
        tooltip: {
            enabled: true,
            theme: undefined,
            style: {
                fontFamily: "Exo 2"
            },
            x: {
                show: false
            },
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const days = Math.abs(dataPointIndex - series[seriesIndex].length);
                return (`
                    <span
                        class="bg-content3/60 p-2 shadow-none"
                    >
                    <b>${series[seriesIndex][dataPointIndex]}pp</b> ${days > 1 ? `at ${days - 1} days ago` : "today"}
                    </span >
                    `);
            },
            fixed: {
                enabled: true,
                position: "topLeft",
                offsetY: 60,
            }
        },
    };

    return (
        <Card shadow="none" id="general" radius="sm">
            <CardHeader className="bg-content3">
                <div className="flex items-center gap-4 text-xl">
                    <FaInfoCircle height={32} width={32} />
                    general
                </div>
            </CardHeader>
            <CardBody className="bg-content3/40 p-4">
                {isLoading ? <Spinner color="default" /> : (
                    <div className="sm:flex flex-grow justify-between">
                        <div className="flex flex-col w-full">
                            <div className="h-200">
                                <Chart
                                    options={options}
                                    series={[{ name: "Performance points", data: [1, 2, 3, 4, 5, 6, 7, 12, 59, 102, 592] }]}
                                    type="line"
                                    height={200}
                                    width="100%"
                                />
                            </div>
                            <div className="flex gap-x-4 flex-wrap">
                                <span className="text-default-600 flex gap-x-1">
                                    <b>Joined </b>
                                    <Tooltip
                                        content={joinedDate.toLocaleDateString()}
                                    >
                                        {timeAgo.format(joinedDate)}
                                    </Tooltip>
                                </span>
                                <span className="text-default-600 flex gap-x-1">
                                    <b>Last seen </b>
                                    <Tooltip
                                        content={lastSeenDate.toLocaleDateString()}
                                    >
                                        {timeAgo.format(lastSeenDate)}
                                    </Tooltip>
                                </span>
                                <span className="text-default-600"><b>Plays with</b> {getPlaystyles(props.userInfo.playstyles).join(", ")}</span>
                            </div>
                        </div>
                        <Divider orientation="vertical" className="mx-8 hidden sm:block" />
                        <div className="min-w-[250px] content-center">
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Global rank</span>
                                <span>#{data.rank.global}</span>
                            </div><div className="flex justify-between">
                                <span className="text-default-600 mr-6">
                                    Country rank
                                    <span
                                        className={
                                            `ml-2 flag rounded-md flag-xs flag-country-${props.userInfo.country.toLowerCase()}`
                                        }
                                    /></span>
                                <span>#{data.rank.country}</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Performance points</span>
                                <span>{data.pp.toLocaleString("en-US")}pp</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Accuracy</span>
                                <span>{data.accuracy.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Ranked score</span>
                                <span>{data.ranked_score.toLocaleString("en-US")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Total score</span>
                                <span>{data.total_score.toLocaleString("en-US")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Max combo</span>
                                <span>{data.max_combo.toLocaleString("en-US")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Play count</span>
                                <span>{data.playcount.toLocaleString("en-US")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-default-600 mr-6">Replays watched by others</span>
                                <span>{data.replays_watched_by_others.toLocaleString("en-US")}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card >
    );
};