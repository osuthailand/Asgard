/* eslint-disable no-unused-vars */
import CredentialsProvider from "next-auth/providers/credentials";

import jwt from "jsonwebtoken";
import { MD5 } from "crypto-js";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

type JWTDecodedPayload = {
    id: number,
    username: string,
    privileges: number,
    is_bat: boolean,
    is_staff: boolean,
    is_admin: boolean,
    accessToken: string;
}

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt({ token, user }: {token: JWT, user: any }) {
            if (user) {
                return user;
            }
            return token;
        },
        session({ session, token }: { session: Session, token: JWT }) {
            session.user = {...token};
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<JWTDecodedPayload> {
                if (!credentials)
                    throw new Error("Missing required input.");

                const encodedPassword = MD5(credentials.password);
                
                const retardedAssLanguage = new FormData();
                retardedAssLanguage.append("username", credentials.username);
                retardedAssLanguage.append("password", encodedPassword.toString());
                
                var user = await fetch(process.env.RINA_API_URL + "/api/auth/token", {
                    method: "POST",
                    body: retardedAssLanguage
                });
                var response = await user.json();
                
                if (!response) {
                    throw new Error("no response");
                }
                
                if (response.error) {
                    throw new Error("Invalid login.");
                }
                
                const access_token = response.access_token;
                const decoded = jwt.verify(access_token, process.env.NEXTAUTH_SECRET as string);

                if (typeof decoded == "string") {
                    throw new Error("idk"+decoded);
                }

                const fart: JWTDecodedPayload = decoded.context;
                return {
                    ...fart,
                    id: decoded.sub as unknown as number,
                    accessToken: access_token
                };
            }
        }),
    ]
}; 