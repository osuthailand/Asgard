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
    Button,
    useDisclosure,
    ModalContent,
    Modal,
    Input,
    Spinner
} from "@nextui-org/react";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Login from "./login";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IconUserPlus } from "@tabler/icons-react";
import { FaSearch } from "react-icons/fa";

function Search(props: {
    onClose: () => void;
}) {
    const [users, setUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const searchForUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (event.target.value === "") {
                setUsers([]);
                return;
            }
            setIsSearching(true);
            fetch("https://api.rina.place/api/users/search?query=" + event.target.value)
                .then(response => response.json())
                .then(data => { console.log(data); setUsers(data); setIsSearching(false); })
                .catch(error => alert("Something went wrong while searching, contact a developer about this."));
        }, 500);
    };

    return (
        <>
            <div className="py-4 px-8">
                <Input
                    classNames={{
                        base: "w-full h-12",
                        mainWrapper: "h-full rounded-md",
                        input: "text-lg ml-4",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-500/20 px-4"
                    }}
                    placeholder="Type to search..."
                    size="sm"
                    startContent={!isSearching ? <FaSearch size={18} /> : <Spinner size="sm" color="default" />}
                    type="search"
                    onChange={(event) => searchForUsers(event)}
                />
            </div>
            {users.length !== 0 ? (
                <div className="px-16 bg-content2/50 py-4 flex flex-col space-y-1">
                    {users.map((user: any) => (
                        <Link
                            key={user.id}
                            href={"/user/" + user.id}
                            onClick={() => props.onClose()}
                        >
                            <div className="bg-content3/50 px-2 py-2 rounded-md w-full hover:bg-content3/70">
                                <div className="flex">
                                    <Image
                                        alt={user.username + "'s avatar"}
                                        src={"https://a.rina.place/" + user.id}
                                        height={256 / 6}
                                        width={256 / 6}
                                        className={
                                            "rounded-lg"
                                        }
                                    />
                                    <div className="flex space-x-2 items-center ml-4 font-[16px]">
                                        <span
                                            className={
                                                `flag rounded-md flag-xs flag-country-${user.country.toLowerCase()}`
                                            }
                                        />
                                        <p>{user.username}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : null}
        </>
    );
}

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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <>

            <div className="bg-content1 border-divider border-b mt-0 -sm:px-4">
                <NextUINavbar onMenuOpenChange={setIsMenuOpen} maxWidth={"full"} classNames={{
                    base: "max-w-[1127px] mx-auto bg-content1",
                    wrapper: "p-0",
                }}>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarContent className="-sm:hidden gap-4" justify="start">
                        <NavbarItemWrapper title="homepage" href="/" />
                        <NavbarItemWrapper title="leaderboard" href="/leaderboard/osu/vanilla" />
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <Button
                            onPress={onOpen}
                            isIconOnly
                            variant="flat"
                            disableRipple
                            radius="full"
                        >
                            <FaSearch />
                        </Button>
                        <Modal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            placement="top-center"
                            hideCloseButton
                            shouldBlockScroll={false}
                            classNames={{
                                base: "max-w-[1127px] container-shadow",
                                wrapper: "w-full"
                            }}
                        >
                            <ModalContent>
                                {(onClose) => <Search onClose={onClose} />}
                            </ModalContent>
                        </Modal >
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
        </>
    );
};