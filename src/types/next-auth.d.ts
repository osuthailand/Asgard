/* eslint-disable no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            username: string,
            privileges: number,
            is_bat: boolean,
            is_staff: boolean,
            is_admin: boolean
        }
    }
    interface User {
        id: number
        username: string,
        privileges: number,
        is_bat: boolean,
        is_staff: boolean,
        is_admin: boolean
    }
}