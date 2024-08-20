/* eslint-disable react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import Container from "../components/container";
import { Button, Card, Input } from "@nextui-org/react";
import Image from "next/image";
import { ReactNode } from "react";
import Link from "next/link";

const SettingInput = (props: {
    label: string;
    placeholder: string;
    startContent?: ReactNode;
    isReadOnly?: boolean;
}) => {
    return (
        <>
            <label className="text-default-700">
                {props.label}
            </label>
            <Input
                isReadOnly={props.isReadOnly}
                startContent={props.startContent}
                placeholder={props.placeholder}
                variant="faded"
                labelPlacement="outside-left"
                type="text"
                classNames={{
                    base: "w-full",
                    mainWrapper: "w-full"
                }}
            />
        </>
    );
};

export default async function Page() {
    const session = await getServerSession(options);

    if (!session) {
        throw Error("Unauthorized");
    }

    return (
        <Container>
            <Card shadow="none" className="rounded-md">
                <div className="px-8 py-4">
                    <p className="text-xl text-default-700">avatar</p>
                    <p className="text-default-500">make sure your avatar follows our rules!</p>
                </div>
                <div className="flex bg-content2/40">
                    <div className="flex items-center py-4 min-w-[40rem] mx-auto">
                        <Image
                            alt={session.user.username + "'s avatar"}
                            id="avatarShowcase"
                            src={"https://a.rina.place/" + session.user.id}
                            height={180}
                            width={180}
                            className="rounded-md mr-4"
                        />
                        <div className="flex-col">
                            <Input variant="faded" type="file" accept="image/png, image/jpeg" className="w-full mb-4" />
                            <Button
                                variant="faded"
                                className="hover:border-red-500 hover:text-red-500"
                            >
                                reset avatar
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-4">
                    <p className="text-xl text-default-700">account information</p>
                </div>
                <div className="flex bg-content2/40">
                    <div className="grid settings-grid-columns gap-y-2 py-4 min-w-[40rem] items-center mx-auto">
                        <SettingInput label="username" placeholder={session.user.username} isReadOnly />
                        <SettingInput
                            label="country"
                            placeholder={"Denmark"}
                            startContent={
                                <span className={"flag flag-country-dk"} />
                            }
                            isReadOnly
                        />
                        <SettingInput label="email" placeholder="email here" />
                    </div>
                </div>
                <div className="px-8 py-4">
                    <p className="text-xl text-default-700">userpage content</p>
                    <p className="text-default-500">
                        make sure your userpage content doesn't include anything we don't allow!
                    </p>
                </div>
                <div className="flex bg-content2/40">
                    <div className="py-4 min-w-[40rem] mx-auto">
                        <Input
                            type="textarea"
                            variant="faded"
                        />
                        <Link
                            href="https://www.bbcode.org/reference.php"
                            className="text-sm text-default-500 hover:underline"
                        >
                            check out bbcode's documentation to see what you can create!
                        </Link>
                    </div>
                </div>
            </Card>
        </Container>
    );
}