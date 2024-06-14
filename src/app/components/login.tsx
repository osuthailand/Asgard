"use client";

import { Button, Link as NextUILink, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { FormEvent } from "react";
import Link from "next/link";
import { IconLogin2 } from "@tabler/icons-react";

export default function Login() {
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            signIn("credentials", {
                username: username,
                password: password,
                redirect: false,
            }).then(async (res) => {
                setLoading(false);
                if (res?.error) {
                    setError(res.error);
                } else {
                    router.refresh();
                }
            });
        } catch (err: any) {
            setError(err);
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className="flex flex-col relative px-4 py-2"
        >
            <h4 className="font-semibold text-large mb-4">Login to continue</h4>
            {error !== "" ? (
                <p className="text-danger">{error}</p>
            ) : null}
            <Input
                isRequired
                label="Username"
                name="username"
                placeholder="Enter your username"
                type="text"
                isDisabled={loading}
                tabIndex={0}
                className="mb-2"
            />
            <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                isDisabled={loading}
                tabIndex={1}
            />
            <NextUILink
                as={Link}
                href="/forgot"
                size="sm"
                color="danger"
            >
                Forgotten password?
            </NextUILink>
            <div className="flex justify-end mt-2">
                <Button type="submit" color="primary" isDisabled={loading} endContent={<IconLogin2 />}>
                    Login
                </Button>
            </div>
            {loading ? <Spinner size="lg" className="absolute z-2 bottom-0 top-0 left-0 right-0" /> : null}
        </form >
    );
} 