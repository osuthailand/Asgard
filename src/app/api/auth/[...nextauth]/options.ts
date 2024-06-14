import CredentialsProvider from "next-auth/providers/credentials";

import jwt from "jsonwebtoken";
import { MD5 } from "crypto-js";

export const options = {
    secret: process.env.SECRET_KEY,
    callbacks: {
        // i hate this and i feel like it's wrong, revisit this in 2077.
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.privileges = user.privileges;
                token.is_bat = user.is_bat;
                token.is_staff = user.is_staff;
                token.is_admin = user.is_admin;
                return token;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.username = token.username;
            session.user.privileges = token.privileges;
            session.user.is_bat = token.is_bat;
            session.user.is_staff = token.is_staff;
            session.user.is_admin = token.is_admin;
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
            async authorize(credentials, req) {
                const encodedPassword = MD5(credentials.password);
                
                const retardedAssLanguage = new FormData();
                retardedAssLanguage.append("username", credentials.username);
                retardedAssLanguage.append("password", encodedPassword.toString());
                
                var user = await fetch("https://api.rina.place/api/v1/auth/token", {
                    method: "POST",
                    body: retardedAssLanguage
                });
                var response = await user.json();
                
                if (!response) {
                    throw new Error("no response");
                }
                
                if (response.error) {
                    throw new Error(response.error);
                }
                
                var access_token = response.access_token;
                var decoded = jwt.verify(access_token, process.env.SECRET_KEY as string);
                return {
                    ...decoded.context,
                    id: decoded.sub
                };
            }
        }),
    ]
}; 