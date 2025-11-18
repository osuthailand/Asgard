/* eslint-disable react/no-unescaped-entities */
"use client";

import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import Container from "../components/container";
import { Button, Card, Input } from "@nextui-org/react";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export default function Page() {
    const { data: session } = useSession();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [uploadStatus, setUploadStatus] = useState<string>("");

    useEffect(() => {
        if (session?.user.id) {
            setAvatarPreview(`https://a.rina.place/${session.user.id}?t=${Date.now()}`);
            setBannerPreview(`https://b.rina.place/${session.user.id}?t=${Date.now()}`);
        }
    }, [session]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const uploadAvatar = async () => {
        if (!avatarFile || !session?.user.accessToken) return;

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        setUploadStatus("Uploading avatar...");

        try {
            const response = await fetch("https://api.rina.place/api/settings/avatar", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.user.accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("Avatar uploaded successfully!");
                setAvatarFile(null);
                setTimeout(() => {
                    setAvatarPreview(`https://a.rina.place/${session.user.id}?t=${Date.now()}`);
                    setUploadStatus("");
                }, 1500);
            } else {
                setUploadStatus("Failed to upload avatar");
            }
        } catch (error) {
            setUploadStatus("Error uploading avatar");
        }
    };

    const uploadBanner = async () => {
        if (!bannerFile || !session?.user.accessToken) return;

        const formData = new FormData();
        formData.append("banner", bannerFile);

        setUploadStatus("Uploading banner...");

        try {
            const response = await fetch("https://api.rina.place/api/settings/banner", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.user.accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("Banner uploaded successfully!");
                setBannerFile(null);
                setTimeout(() => {
                    setBannerPreview(`https://b.rina.place/${session.user.id}?t=${Date.now()}`);
                    setUploadStatus("");
                }, 1500);
            } else {
                setUploadStatus("Failed to upload banner");
            }
        } catch (error) {
            setUploadStatus("Error uploading banner");
        }
    };

    const resetAvatar = async () => {
        if (!session?.user.accessToken) return;

        setUploadStatus("Resetting avatar...");

        try {
            const response = await fetch("https://api.rina.place/api/settings/avatar", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.user.accessToken}`,
                },
            });

            if (response.ok) {
                setUploadStatus("Avatar reset successfully!");
                setTimeout(() => {
                    setAvatarPreview(`https://a.rina.place/${session.user.id}?t=${Date.now()}`);
                    setUploadStatus("");
                }, 1500);
            } else {
                setUploadStatus("Failed to reset avatar");
            }
        } catch (error) {
            setUploadStatus("Error resetting avatar");
        }
    };

    const resetBanner = async () => {
        if (!session?.user.accessToken) return;

        setUploadStatus("Resetting banner...");

        try {
            const response = await fetch("https://api.rina.place/api/settings/banner", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.user.accessToken}`,
                },
            });

            if (response.ok) {
                setUploadStatus("Banner reset successfully!");
                setTimeout(() => {
                    setBannerPreview(`https://b.rina.place/${session.user.id}?t=${Date.now()}`);
                    setUploadStatus("");
                }, 1500);
            } else {
                setUploadStatus("Failed to reset banner");
            }
        } catch (error) {
            setUploadStatus("Error resetting banner");
        }
    };

    if (!session) {
        return (
            <Container>
                <Card shadow="none" className="rounded-md">
                    <div className="px-8 py-4">
                        <p className="text-xl text-default-700">Unauthorized</p>
                        <p className="text-default-500">Please log in to access settings.</p>
                    </div>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            {uploadStatus && (
                <div className="mb-4 p-4 bg-primary-600/20 rounded-md text-center">
                    {uploadStatus}
                </div>
            )}
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
                            src={avatarPreview}
                            height={180}
                            width={180}
                            className="rounded-md mr-4"
                        />
                        <div className="flex-col space-y-4">
                            <Input
                                variant="faded"
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                className="w-full"
                                onChange={handleAvatarChange}
                            />
                            {avatarFile && (
                                <Button
                                    variant="solid"
                                    className="w-full bg-blue-600 hover:bg-blue-500"
                                    onClick={uploadAvatar}
                                >
                                    Upload Avatar
                                </Button>
                            )}
                            <Button
                                variant="faded"
                                className="w-full hover:border-red-500 hover:text-red-500"
                                onClick={resetAvatar}
                            >
                                reset avatar
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-4">
                    <p className="text-xl text-default-700">banner</p>
                    <p className="text-default-500">customize your profile with a banner!</p>
                </div>
                <div className="flex bg-content2/40">
                    <div className="py-4 min-w-[40rem] mx-auto">
                        <Image
                            alt={session.user.username + "'s banner"}
                            id="bannerShowcase"
                            src={bannerPreview}
                            height={200}
                            width={800}
                            className="rounded-md mb-4 w-full object-cover"
                        />
                        <div className="flex-col space-y-4">
                            <Input
                                variant="faded"
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                className="w-full"
                                onChange={handleBannerChange}
                            />
                            {bannerFile && (
                                <Button
                                    variant="solid"
                                    className="w-full bg-blue-600 hover:bg-blue-500"
                                    onClick={uploadBanner}
                                >
                                    Upload Banner
                                </Button>
                            )}
                            <Button
                                variant="faded"
                                className="w-full hover:border-red-500 hover:text-red-500"
                                onClick={resetBanner}
                            >
                                reset banner
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
