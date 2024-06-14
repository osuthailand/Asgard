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
    Tabs,
    Tab,
    DropdownSection
} from "@nextui-org/react";

import React from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./switcher";
import Login from "./login";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
                    <span className="h-[3px] mt-8 bg-blue-700 w-full absolute"></span>
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
                    <ThemeSwitcher />
                    <Dropdown classNames={{
                        base: session == undefined || session == null ? "min-w-[300px]" : ""
                    }}>
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                src={"https://a.rina.place/" + session?.user.id}
                                alt="Login or sign up"
                                className="transition-transform"
                            />
                        </DropdownTrigger>
                        {session == undefined || session == null ? (
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem isReadOnly>
                                    <Tabs disabledKeys={["sign-up"]} fullWidth selectedKey={"login"}>
                                        <Tab key="login" title="Login">
                                            <Login />
                                        </Tab>
                                        <Tab key="sign-up" title="Sign up">
                                            <h1>Not implemented.</h1>
                                        </Tab>
                                    </Tabs>
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
                            Home
                        </NextUILink>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <NextUILink
                            as={Link}
                            className="w-full"
                            href="/leaderboard/osu/vanilla"
                            size="lg"
                        >
                            Leaderboard
                        </NextUILink>
                    </NavbarMenuItem>
                </NavbarMenu>
            </NextUINavbar>
        </div >
    );
}