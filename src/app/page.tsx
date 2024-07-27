import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Container from "./components/container";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
    const session = await getServerSession(options);

    const stats_resp = await fetch("https://c.rina.place");
    const stats = stats_resp.status === 200 ? await stats_resp.json() : null;

    if (session) {
        return (
            <Container>
                <Card className="rounded-md" shadow="none">
                    <div className="flex justify-between py-4 px-16 items-center">
                        <div>
                            <p className="text-xl text-default-600">welcome back,</p>
                            <p className="font-bold text-primary-600 text-[2rem]">{session.user.username}</p>
                        </div>
                        <div className="flex space-x-12">
                            <div className="block text-xl">
                                <p className="text-default-600 mb-1">online</p>
                                <p className="font-bold text-green-400 text-[2rem]">{stats.online_players || 0}</p>
                            </div>
                            <div className="block text-xl">
                                <p className="text-default-600 mb-1">rooms</p>
                                <p className="font-bold text-green-400 text-[2rem]">{stats.multiplayer_rooms || 0}</p>
                            </div>
                        </div>
                    </div>
                    <CardBody className="bg-content3/40 px-8">hej</CardBody>
                </Card>
            </Container>
        );
    }

    return (
        <>
            <Container>
                <Card className="rounded-md" shadow="none">
                    <CardHeader className="absolute z-10 h-full justify-center w-full p-0">
                        <div className="flex min-h-full">
                            <div className="flex w-full -md:hidden">
                                <Image
                                    src="/images/aoba-homepage.png"
                                    height={400}
                                    width={400}
                                    alt="poop"
                                    className="w-auto max-h-[400px]"
                                />
                            </div>
                            <div className="max-w-[563px] px-8 py-14 content-center -md:text-center">
                                <p className="text-[48px] font-bold text-white">play rina!</p>
                                <p className="text-[16px]">
                                    rina is one of the oldest and biggest osu! servers,
                                    allowing relax scores with our custom pp reworks!
                                    the community consists of over 9000 registered users
                                    and still growing! we run the server democratically,
                                    where we periodically hold polls on the discord server
                                    with feature ideas, to see whether or not people want
                                    them! so do yourself a favor, and play rina!
                                </p>
                                <div className="flex gap-x-2 mt-6 -md:justify-center">
                                    <Button
                                        as={Link}
                                        href="/signup"
                                        className="px-6 rounded-md bg-blue-600 shadow-md hover:bg-blue-500"
                                    >
                                        sign up!
                                    </Button>
                                    <Button
                                        as={Link}
                                        href="/docs/guide/connect"
                                        className="px-6 rounded-md shadow-md bg-violet-700 hover:bg-violet-500"
                                    >
                                        how to connect
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <video
                        loop
                        autoPlay
                        muted
                        src="/videos/preview.mp4"
                        className="z-0 w-full object-cover h-[400px] rounded-b-none rounded-t-md brightness-50"
                    />
                </Card>
            </Container>
            {stats ? (
                <Container>
                    <div
                        className={
                            "py-4 px-[14rem] -md:px-[4rem] rounded-md bg-content1 " +
                            "text-center flex justify-between -md:flex-col -md:gap-4"
                        }
                    >
                        <div className="-md:flex -md:items-center -md:justify-between">
                            <span className="text-md">total users</span>
                            <p className="text-xl text-blue-400 font-bold">
                                {Intl.NumberFormat(
                                    "en",
                                    { notation: "standard" }
                                ).format(stats.registered_players)}
                            </p>
                        </div>
                        <div className="-md:flex -md:items-center -md:justify-between">
                            <span className="text-md">online players</span>
                            <p className="text-xl text-green-400 font-bold">{stats.online_players}</p>
                        </div>
                        <div className="-md:flex -md:items-center -md:justify-between">
                            <span className="text-md">scores</span>
                            <p className="text-xl text-indigo-400 font-bold">
                                {Intl.NumberFormat("en", { notation: "standard" }).format(stats.total_scores)}
                            </p>
                        </div>
                        <div className="-md:flex -md:items-center -md:justify-between">
                            <span className="text-md">total pp</span>
                            <p className="text-xl text-red-400 font-bold">
                                {Intl.NumberFormat(
                                    "en",
                                    {
                                        notation: "compact",
                                    }
                                ).format(stats.accumulated_pp)}
                            </p>
                        </div>
                    </div>
                </Container>
            ) : null}
            {/* <Container>
                    <div className="grid grid-cols-3">
                        <div className="bg-content1 col-span-2 px-8 py-4 rounded-l-md">
                            <span className="relative mb-4">
                                latest news
                                <span className="h-[3px] mt-7 bg-indigo-700 w-full absolute right-0"></span>
                            </span>
                            <div className="bg-content2 p-4 mt-4 rounded-md w-full">
                                <span className="">{"we're so back"}</span>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-content1/40 rounded-r-md">
                            <span className="relative mb-4">
                                latest registered users
                                <span className="h-[3px] mt-7 bg-blue-400 w-full absolute right-0"></span>
                            </span>
                            <div className="bg-content2 p-4 mt-4 rounded-md w-full">
                                <span className="">{"we're so back"}</span>
                            </div>
                        </div>
                    </div>
                </Container> */}
        </>
    );
}
