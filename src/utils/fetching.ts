import { Session } from "next-auth";

export function fetchWithSession(url: string, session: Session | null): Promise<any> {
    if (session) {
        return fetch(url, { headers: {
            Authorization: "Bearer " + session?.user.accessToken
        }});
    }

    return fetch(url);
}