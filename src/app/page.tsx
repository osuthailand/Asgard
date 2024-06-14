"use client";

import { useSession } from "next-auth/react";

export default function Home() {
    const session = useSession();
    return <h1>{JSON.stringify(session)}</h1>;
}
