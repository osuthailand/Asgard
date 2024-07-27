import { NextRequest, NextResponse } from "next/server";
import { Beatmap } from "./types/beatmap";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;  

    if (pathname.startsWith("/b/")) {
        const mapID = request.nextUrl.pathname.slice(3);

        const response = await fetch(
            `https://api.rina.place/api/beatmap/map/${mapID}`
        );
        const data: Beatmap = await response.json();

        if (data.error || data.detail) {
            throw Error("beatmap not found");
        }

        return NextResponse.redirect(new URL(`/beatmapsets/${data.set_id}/${data.map_id}`, request.url));
    }

    if (pathname.startsWith("/u/")) {
        const userID = request.nextUrl.pathname.slice(3);
        return NextResponse.redirect(new URL("/user/" + userID, request.url));
    }
}

export const config = {
    matcher: ["/b/:mapID*", "/u/:userID*"]
};