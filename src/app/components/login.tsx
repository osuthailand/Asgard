"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { FormEvent } from "react";

export default function Login() {
    const [error, setError] = React.useState("");
    const router = useRouter();

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            signIn("credentials", {
                username: username,
                password: password,
                redirect: false,
            }).then(async (res) => {
                if (res?.error) {
                    setError(res.error);
                } else {
                    router.refresh();
                }
            });
        } catch (err: any) {
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4">
            <Input
                isRequired
                isInvalid={error !== ""}
                errorMessage={error}
                label="Username"
                name="username"
                placeholder="Enter your username"
                type="text"
                tabIndex={0}
            />
            <Input
                isRequired
                isInvalid={error !== ""}
                errorMessage={error}
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                tabIndex={1}
            />
            <div className="flex gap-2 justify-end">
                <Button type="submit" fullWidth color="primary">
                    Login
                </Button>
            </div>
        </form >
    );
} 