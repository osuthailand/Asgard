"use client";

import {
    Link as NextUILink,
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button
} from "@nextui-org/react";

import React from "react";
import Link from "next/link";
import Login from "./login";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IconUserPlus } from "@tabler/icons-react";

function NavbarItemWrapper(props: {
    title: string,
    href: string,
}) {
    const pathname = usePathname();
    return (
        <NavbarItem>
            <NextUILink as={Link} className="relative text-default-800" href={props.href}>
                {props.title}

                {/* osu style */}
                {pathname == props.href ? (
                    <span className="h-[3px] mt-8 bg-content3 w-full absolute"></span>
                ) : null}
            </NextUILink>
        </NavbarItem >
    );
}

export default function Navbar() {
    const { data: session } = useSession();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="bg-content1 mb-8 border-divider border-b mt-0 px-4 sm:px-0">
            <NextUINavbar onMenuOpenChange={setIsMenuOpen} maxWidth={"full"} classNames={{
                base: "max-w-[1127px] mx-auto bg-content1",
                wrapper: "p-0",
            }}>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    <NavbarItemWrapper title="homepage" href="/" />
                    <NavbarItemWrapper title="leaderboard" href="/leaderboard/osu/vanilla" />
                </NavbarContent>
                <NavbarContent justify="end">
                    <Dropdown classNames={{
                        base: !session ? "w-[350px]" : "",
                        content: !session ? "p-0" : ""
                    }}>
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                src={"https://a.rina.place/" + session?.user.id}
                                alt="Login or sign up"
                                className="transition-transform"
                            />
                        </DropdownTrigger>
                        {!session ? (
                            <DropdownMenu
                                aria-label="Profile Actions"
                                variant="flat"
                                className="p-0"
                            >
                                <DropdownItem isReadOnly>
                                    <Login />
                                </DropdownItem>
                                <DropdownItem
                                    isReadOnly
                                    className="bg-content2 rounded-t-none px-6 py-3.5 no-truncation"
                                >
                                    <h4 className="text-large font-semibold mb-2">No account?</h4>
                                    <p className="text-default-500 mb-4">
                                        Go ahead and sign up to quickly make an account and join the server
                                        with the rest of the players!
                                    </p>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            isDisabled
                                            className="w-[8rem] flex justify-between"
                                        >
                                            Sign up!
                                            <IconUserPlus />
                                        </Button>
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        ) : (
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownSection aria-label="Profile" showDivider>
                                    <DropdownItem href={"/user/" + session.user.id}>
                                        My profile
                                    </DropdownItem>
                                    <DropdownItem href="/friends">
                                        Friends
                                    </DropdownItem>
                                    <DropdownItem href="/settings">
                                        Settings
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection aria-label="Preferences">
                                    <DropdownItem onClick={() => signOut()}>
                                        Sign out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        )}
                    </Dropdown>
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>
                        <NextUILink
                            as={Link}
                            className="w-full"
                            href="/"
                            size="lg"
                        >
                            home
                        </NextUILink>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <NextUILink
                            as={Link}
                            className="w-full"
                            href="/leaderboard/osu/vanilla"
                            size="lg"
                        >
                            leaderboard
                        </NextUILink>
                    </NavbarMenuItem>
                </NavbarMenu>
            </NextUINavbar>
        </div >
    );
}