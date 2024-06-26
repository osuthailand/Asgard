import { gamemodeToNum, numToGamemode, numToPlaymode, playModeToNum } from "@/utils/modes";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import UserStats from "./components/stats";
import { ReactNode } from "react";
import { FaCode, FaItunesNote, FaTrophy, FaUserCheck, FaFaceAngry } from "react-icons/fa6";
import { SiStaffbase } from "react-icons/si";
import RecentActivity from "./components/recent";
import Scores from "./components/scores";
import { UserProfileData } from "@/types/profile";
import { Country } from "@/utils/country";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendButton from "./components/friend";
import { Privileges } from "@/utils/privileges";

import DefaultAvatar from "../../../../../public/images/default-avatar.png";

function ensureCorrectQuery(slug: Array<string> | undefined, preferred_gamemode: string, preferred_mode: string) {
    if (slug == undefined) {
        return { gamemode: preferred_gamemode, playmode: preferred_mode };
    }

    if (slug.length > 2) {
        throw new Error("invalid slug print");
    }

    const gamemode = slug[0] || preferred_gamemode;
    const playmode = slug[1] || preferred_mode;

    if (!(["vanilla", "relax"].includes(gamemode))) {
        throw new Error("invalid gamemode");
    }

    if (!(["osu", "taiko", "catch", "mania"].includes(playmode))) {
        throw new Error("invalid playmode");
    }

    return { gamemode, playmode };
}

export default async function Page({ params }: { params: { userID: number; slug: any; }; }) {
    const session = await getServerSession(options);

    const resp = await fetch(`https://api.rina.place/api/users/get/${params.userID}`, { next: { revalidate: 10 } });
    const user: UserProfileData = await resp.json();

    if (user?.error || user?.detail) {
        throw new Error(user.error || JSON.stringify(user.detail));
    }

    const { gamemode, playmode } = ensureCorrectQuery(
        params.slug,
        numToGamemode(user.preferred_gamemode),
        numToPlaymode(user.preferred_mode)
    );

    const ModeButton = (props: {
        href: string;
        title: string;
        mode?: string;
        isGamemode?: boolean;
    }) => {
        const isActive = props.mode === (!props.isGamemode ? playmode : gamemode);
        return (
            <Button
                as={Link}
                href={props.href}
                isDisabled={gamemode === "relax" && props.mode === "mania"}
                variant={isActive ? "solid" : "light"}
                className="min-w-[5rem] rounded-md px-2 h-8 text-[15px] "
            >
                {props.title}
            </Button >
        );
    };

    const BadgeChip = (props: {
        badge: string,
        icon: ReactNode;
    }) => {
        return (
            <Chip
                className="bg-content3/60"
                radius="sm"
                size="lg"
                variant="flat"
                classNames={{
                    content: "flex flex-grow gap-2 justify-between items-center"
                }}
            >
                {props.icon}
                {props.badge}
            </Chip>
        );
    };

    if (!(user.privileges & Privileges.VERIFIED) && !session?.user.is_admin) {
        return <>user not found</>;
    }

    return (
        <>
            {!(user.privileges & Privileges.VERIFIED) && session?.user.is_admin ? (
                <div className="w-full mb-8 text-center py-4 bg-[#9c2b2e] border-t border-b border-[#e84e4f]">
                    {user.username} is restricted!
                </div>
            ) : null}
            <div className="max-w-[1127px] mx-auto container-shadow">
                <div className="w-full bg-content1 rounded-t-lg">
                    <div className="flex flex-grow justify-between px-8 p-2">
                        <div className="flex gap-2">
                            <ModeButton
                                href={`/user/${user.id}/vanilla/${playmode}`}
                                mode="vanilla"
                                title="vanilla"
                                isGamemode />
                            <ModeButton
                                href={`/user/${user.id}/relax/${playmode}`}
                                mode="relax"
                                title="relax"
                                isGamemode />
                        </div>
                        <div className="flex gap-2">
                            <ModeButton href={`/user/${user.id}/${gamemode}/osu`} mode="osu" title="osu!" />
                            <ModeButton href={`/user/${user.id}/${gamemode}/taiko`} mode="taiko" title="osu!taiko" />
                            <ModeButton href={`/user/${user.id}/${gamemode}/catch`} mode="catch" title="osu!catch" />
                            <ModeButton href={`/user/${user.id}/${gamemode}/mania`} mode="mania" title="osu!mania" />
                        </div>
                    </div>
                </div>
                <Card className="rounded-none shadow-none">
                    <div className="min-h-[250px] overflow-visible z-0 p-0">
                        <img
                            height={250}
                            width={1127}
                            alt=""
                            className="w-full absolute z-0 object-fill rounded-none h-[250px]"
                            src={"https://a.rina.place/" + user.id}
                        />
                    </div>
                    <CardFooter className="rounded-b-none p-6 ">
                        <img
                            alt=""
                            src={"https://a.rina.place/" + user.id}
                            height={140}
                            width={140}
                            className={
                                "rounded-lg absolute bottom-6 z-10 "
                            }
                        />
                        <div className="flex flex-grow justify-between items-center">
                            <div className="w-full flex place-content-center flex-col col-span-6 ml-[160px]">
                                <span className="font-semibold flex  items-center leading-none text-[1.7rem]">
                                    {user.clan.id !== undefined ?
                                        <Link
                                            className="text-primary-700 hover me-2"
                                            href={"/clans/" + user.clan.id}
                                        >
                                            [{user.clan.tag}]
                                        </Link>
                                        : null
                                    }
                                    <Tooltip
                                        content={
                                            <div className="max-w-60">
                                                Previously known as:&nbsp;
                                                {user.name_history.map(entry => entry.changed_from).join(", ")}
                                            </div>
                                        }
                                        className="bg-content3"
                                        delay={0}
                                        closeDelay={0}
                                    >
                                        {user.username}
                                    </Tooltip>
                                </span>
                                <span className="items-center align-middle text-default-700 flex mt-2">
                                    <span
                                        className={
                                            `mr-2 flag rounded-md flag-sm flag-country-${user.country.toLowerCase()}`
                                        }
                                    />
                                    {(Country as any)[user.country] || "Unknown"}
                                </span>
                            </div>
                            <div>
                                <FriendButton
                                    userID={user.id}
                                    session={session}
                                />
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <div className="w-full h-auto flex-wrap bg-content3/40 flex px-6 py-4 gap-4">
                    <BadgeChip badge="Verified" icon={<FaUserCheck size={18} />} />
                    <BadgeChip badge="Developer" icon={<FaCode size={18} />} />
                    <BadgeChip badge="Staff" icon={<SiStaffbase size={18} />} />
                    <BadgeChip badge="don't @ me" icon={<FaFaceAngry size={18} />} />
                </div>
                <div className="panel-bg sticky gap-5 z-20 top-0 w-full flex justify-center">
                    <Link href="#general" className="p-4">
                        general
                    </Link>
                    <Link href="#recent" className="p-4">
                        recent
                    </Link>
                    <Link href="#ranks" className="p-4">
                        ranks
                    </Link>
                    <Link href="#beatmaps" className="p-4">
                        beatmaps
                    </Link>
                    <Link href="#achievements" className="p-4">
                        achievements
                    </Link>
                </div>
                <div className="px-6 py-4 w-full z-0 grid gap-y-4 bg-content1">
                    <UserStats
                        userInfo={user}
                        gamemode={gamemodeToNum(gamemode)}
                        playMode={playModeToNum(playmode)} />
                    <RecentActivity
                        username={user.username}
                        userID={params.userID}
                        gamemode={gamemodeToNum(gamemode)}
                        playMode={playModeToNum(playmode)} />
                    <Scores
                        userID={params.userID}
                        gamemode={gamemodeToNum(gamemode)}
                        playMode={playModeToNum(playmode)} />
                    <Card shadow="none" id="beatmaps" radius="sm">
                        <CardHeader className="bg-content2">
                            <div className="flex items-center gap-4 text-xl">
                                <FaItunesNote height={32} width={32} />
                                beatmaps
                            </div>
                        </CardHeader>
                        <CardBody className="bg-content3/80">
                            general information .... pp graph blah blah blah yatta yatta yattaa
                        </CardBody>
                    </Card>
                    <Card shadow="none" id="achievements" radius="sm">
                        <CardHeader className="bg-content2">
                            <div className="flex items-center gap-4 text-xl">
                                <FaTrophy height={32} width={32} />
                                achievements
                            </div>
                        </CardHeader>
                        <CardBody className="bg-content3/80">
                            general information .... pp graph blah blah blah yatta yatta yattaa
                        </CardBody>
                    </Card>
                </div>
            </div >
        </>
    );
}