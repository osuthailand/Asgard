/* eslint-disable no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            username: string
            privileges: number
            is_bat: boolean
            is_staff: boolean
            is_admin: boolean

            accessToken: string
        }
    }
    
    interface User {
        id: number
        username: string
        privileges: number
        is_bat: boolean
        is_staff: boolean
        is_admin: boolean

        accessToken: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number
        username: string
        privileges: number
        is_bat: boolean
        is_staff: boolean
        is_admin: boolean
        accessToken: string
    }
}