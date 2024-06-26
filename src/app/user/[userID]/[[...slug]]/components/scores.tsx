"use client";

import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner
} from "@nextui-org/react";

import { FaRankingStar } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { getModCombinationNames } from "@/utils/mods";
import { ScoreType } from "@/types/score";

function IndividualScorePanel(props: {
    userID: number,
    gamemode: number,
    playMode: number,
    type: string,
}) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<ScoreType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`https://api.rina.place/api/users/scores/${props.userID}/${props.type}` +
            `?gamemode=${props.gamemode}&mode=${props.playMode}&page=${page}`
        ).then(res => res.json()).then(data => {
            if (data.error || data.detail)
                throw new Error(data.error || data.detail);
            setIsLoading(false);
            setData(data);
        });
    }, []);

    const loadMore = () => {
        setIsLoading(true);
        setPage(page + 1);
        fetch(`https://api.rina.place/api/users/scores/${props.userID}/${props.type}` +
            `?gamemode=${props.gamemode}&mode=${props.playMode}&page=${page + 1}`
        ).then(res => res.json().then(json => {
            if (json.error || json.detail)
                throw new Error(json.error || json.detail);

            setIsLoading(false);
            setData([...data, ...json]);
        }));

    };

    return (
        <div className="grid gap-y-[0.25rem]">
            {isLoading && data.length == 0 ? <Spinner color="default" /> : (
                data.length > 0 ? (
                    <>
                        {data.map(score => (
                            <div
                                key={score.id}
                                className="flex align-center min-h-[60px] bg-content3/70 rounded-md relative"
                            >
                                <Image
                                    alt="poopy"
                                    src={`https://b.ppy.sh/thumb/${score.set_id}l.jpg`}
                                    height={0}
                                    width={90}
                                    className={
                                        "rounded-l-md brightness-[0.25] max-h-[60px] z-0 absolute left-0 object"
                                    }
                                />
                                <div
                                    className={
                                        "z-10 min-w-[90px] items-center flex justify-center font-bold " +
                                        "text-[32px] beatmap-thumbnail-cut relative rank-" + score.rank.toLowerCase()
                                    }
                                >
                                    {score.rank}
                                </div>
                                <div className="flex w-full justify-between items-center">
                                    <div className="pl-2 py-2 max-w-[600px]">
                                        <p className="text-[15px] truncate">
                                            {score.artist} - {score.title}&nbsp;
                                        </p>
                                        <div className="flex text-[13px]">
                                            <span className="text-default-700 dot-next">{score.version}</span>
                                            <TimeAgo
                                                date={score.submitted * 1000}
                                                className="text-default-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex h-full items-center">
                                        <span className="text-lg font-semibold text-default-700 mr-4">
                                            {getModCombinationNames(score.mods)}
                                        </span>
                                        <div
                                            className={
                                                "text-center flex bg-content2/60 h-full items-center relative"
                                            }
                                        >
                                            <div className="fartmouth min-w-[200px]">
                                                <span>
                                                    <b className="text-lg">{score.pp.toFixed(2)}</b>
                                                    <span className="text-md text-default-700">pp</span>
                                                </span>
                                                <p className="text-sm leading-none">
                                                    <span className="text-default-500">accuracy: </span>
                                                    <span className="text-default-600">
                                                        {score.accuracy.toFixed(2)}%
                                                    </span>
                                                </p>
                                            </div>
                                            <Dropdown shouldBlockScroll={false}>
                                                <DropdownTrigger>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        className="mr-2"
                                                        disableRipple
                                                    >
                                                        <BsThreeDotsVertical size={20} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu disabledKeys={score.rank == "F" ? ["replay"] : []}>
                                                    <DropdownItem key="details" as={Link} href={`/score/${score.id}`}>
                                                        view details
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key={"replay"}
                                                        as={Link}
                                                        href={`https://api.rina.place/api/scores/replay/${score.id}`}
                                                    >
                                                        download replay
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        ))}
                        <div className="flex flex-col items-center">
                            <Button
                                className="w-80"
                                startContent={<IoIosArrowDown />}
                                endContent={<IoIosArrowDown />}
                                onClick={() => loadMore()}
                                isDisabled={data.length != (page * 10)}
                            >
                                <span className="mx-10">{isLoading ? "Loading..." : "show more"}</span>
                            </Button>
                        </div>
                    </>
                ) : "No scores."
            )}
        </div >
    );
}

export default function Scores(props: {
    userID: number,
    gamemode: number,
    playMode: number,
}) {
    return (
        <Card shadow="none" id="ranks" radius="sm">
            <CardHeader className="bg-content3">
                <div className="flex items-center gap-4 text-xl">
                    <FaRankingStar height={32} width={32} />
                    ranks
                </div>
            </CardHeader>
            <CardBody className="bg-content3/40 p-4">
                <span className="flex gap-x-2 text-[16px] mb-4 leading-none">
                    <span className="h-full w-1 rounded-md bg-primary-700"></span>
                    best performances
                </span>
                <IndividualScorePanel
                    userID={props.userID}
                    gamemode={props.gamemode}
                    playMode={props.playMode}
                    type="best"
                />
                <span className="flex gap-x-2 text-[16px] mb-4 leading-none mt-4">
                    <span className="h-full w-1 rounded-md bg-primary-700"></span>
                    recent performances
                </span>
                <IndividualScorePanel
                    userID={props.userID}
                    gamemode={props.gamemode}
                    playMode={props.playMode}
                    type="recent"
                />
            </CardBody>
        </Card >
    );
}