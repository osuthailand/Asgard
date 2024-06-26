"use client";

import { Button } from "@nextui-org/react";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useQuery } from "react-query";

export default function FriendButton(props: {
    userID: number,
    session?: Session | null;
}) {
    if (props.session == undefined || props.session.user.id == props.userID) {
        return;
    }

    const { data: relationStatus, isLoading, refetch } = useQuery(["friendship", props.userID], async () => {
        const res = await fetch(`https://api.rina.place/api/friendship/${props.userID}`, {
            headers: {
                "Authorization": "Bearer " + props.session!.user.accessToken,
            },
            method: "GET"
        });
        const data = await res.json();

        if (data.error) {
            return;
        }

        return data.status;
    });

    const handle = () => {
        if (relationStatus == -1) {
            fetch(`https://api.rina.place/api/friendship/${props.userID}`, {
                headers: {
                    Authorization: "Bearer " + props.session!.user.accessToken
                },
                method: "POST"
            });
        } else if ([0, 1].includes(relationStatus)) {
            fetch(`https://api.rina.place/api/friendship/${props.userID}`, {
                headers: {
                    Authorization: "Bearer " + props.session!.user.accessToken
                },
                method: "DELETE"
            });
        }

        refetch();
    };

    if (isLoading) {
        return <Button isLoading={isLoading}></Button>;
    }

    if (relationStatus === -1) {
        return <Button onClick={() => handle()} className="bg-content2" startContent={<FaUser size={16} />}>add friend</Button>;
    }

    if (relationStatus === 0) {
        return <Button onClick={() => handle()} className="osu-following" startContent={<FaUser size={16} />}>remove friend</Button>;
    }

    return <Button onClick={() => handle()} className="osu-mutual" startContent={<FaUserFriends size={16} />}>remove friend</Button>;

}