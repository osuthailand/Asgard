/* eslint-disable indent */
"use client";

import { UserProfileData } from "@/types/profile";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Session } from "next-auth";
import Image from "next/image";
import { FaTrophy } from "react-icons/fa6";
import useSWR from "swr";

type Achievements = {
    id: number;
    name: string;
    description: string;
    icon: string;

    has: boolean;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ProfileAchievements(props: {
    userInfo: UserProfileData;
    session: Session | null;
    playMode: number;
    gamemode: number;
}) {
    const { data: allAchievements, isLoading: isAchievementsLoading } = useSWR<Achievements[]>(
        "https://api.rina.place/api/achievements",
        fetcher
    );

    const { data: userAchievements, isLoading: isUserAchievementsLoading } = useSWR<Achievements[]>(
        `https://api.rina.place/api/users/get/${props.userInfo.id}/achievements` +
        `?gamemode=${props.gamemode}&mode=${props.playMode}`,
        fetcher
    );

    return (
        <Card shadow="none" id="achievements" radius="sm">
            <CardHeader className="bg-content3">
                <div className="flex items-center gap-4 text-xl">
                    <FaTrophy height={32} width={32} />
                    achievements
                </div>
            </CardHeader>
            <CardBody className="bg-content3/40 p-4">
                {isUserAchievementsLoading || isAchievementsLoading ? <Spinner color="default" /> : null}
                {props.session?.user.id == props.userInfo.id ? (
                    <div className="grid grid-cols-8 gap-8">
                        {allAchievements?.map(achievement => (
                            <Image
                                key={achievement.id}
                                alt={achievement.name}
                                height={80}
                                width={80}
                                src={`https://assets.rina.place/medals/client/${achievement.icon}`}
                                className={
                                    !userAchievements?.find(ach => ach.id == achievement.id) ? (
                                        "grayscale opacity-25"
                                    ) : ""
                                }
                            />
                        ))}
                    </div>
                ) : (
                    userAchievements?.length == 0 ? (
                        <span>No achievements... yet.</span>
                    ) : (
                        <div className="grid grid-cols-8 gap-8">
                            {userAchievements?.map(achievement => (
                                <Image
                                    key={achievement.id}
                                    alt={achievement.name}
                                    height={80}
                                    width={80}
                                    src={`https://assets.rina.place/medals/client/${achievement.icon}`}
                                />
                            ))}
                        </div>
                    ))}
            </CardBody>
        </Card >
    );

}