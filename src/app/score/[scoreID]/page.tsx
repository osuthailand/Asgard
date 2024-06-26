import { options } from "@/app/api/auth/[...nextauth]/options";
import WrappedTimeago from "@/app/components/timeago";
import { ScoreType } from "@/types/score";
import { Country } from "@/utils/country";
import { Privileges } from "@/utils/privileges";
import { Card, CardHeader } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";


export default async function Page({ params }: {
    params: {
        scoreID: number;
    };
}) {
    const session = await getServerSession(options);

    const resp = await fetch(`https://api.rina.place/api/score/${params.scoreID}`, {
        cache: "no-store",
        headers: {
            Authorization: "Bearer " + session?.user.accessToken
        }
    });
    const score: ScoreType = await resp.json();

    if (score.error) {
        return score.error;
    }

    return (
        <div className="max-w-[1127px] bg-content1 mx-auto container-shadow rounded-b-md">
            <Card isFooterBlurred className="max-h-[250px] rounded-b-none rounded-t-md">
                <CardHeader className="absolute z-10 px-8 flex justify-between">
                    <p className="text-[48px] text-white">hejjj</p>
                    <p className="text-[48px] text-white">hejjj</p>
                </CardHeader>
                <Image
                    height={250}
                    width={1127}
                    priority={true}
                    alt="Beatmap cover"
                    className="z-0 w-full object-cover rounded-b-none rounded-t-md brightness-[0.4]"
                    src={`https://assets.ppy.sh/beatmaps/${score.beatmap!.set_id}/covers/cover.jpg`}
                />
            </Card>
            {session?.user.id === score.user_id && session!.user.privileges & Privileges.SUPPORTER ? (
                <>
                    <div className="p-8 text-xl">replay watched by {score.viewers ? `${score.viewers.length} user(s)` : "no one :("}</div>
                    <div className="rounded-b-md bg-content2 p-8 grid grid-cols-3 gap-4">
                        {score.viewers?.map(viewer => (
                            <div className="flex h-[100px] items-center rounded-md relative container-shadow">
                                <img
                                    alt={"pooppy head"}
                                    src={"https://a.rina.place/" + viewer.user_id}
                                    height={100}
                                    width={69696969}
                                    className={
                                        "rounded-lg brightness-[0.4] green-fn"
                                    }
                                />
                                <div className="absolute p-4 flex gap-x-4 items-center">
                                    <img
                                        alt={"pooppy head"}
                                        src={"https://a.rina.place/" + viewer.user_id}
                                        height={256 / 4}
                                        width={256 / 4}
                                        className={
                                            "rounded-lg"
                                        }
                                    />
                                    <div className="flex-col">
                                        <Link href={"/user/" + viewer.user_id} className="flex gap-x-1 items-center text-[20px] font-semibold">
                                            <span
                                                className={
                                                    `flag rounded-md flag-xs flag-country-${viewer.country.toLowerCase()}`
                                                }
                                            />
                                            {viewer.username}
                                        </Link>
                                        <span className="text-default-700 text-sm">watched <WrappedTimeago timestamp={viewer.timestamp} /></span>
                                    </div>
                                </div>
                            </div>
                        )) || "no one..."}
                    </div>
                </>
            ) : null}
        </div>
    );
}