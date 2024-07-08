"use client";

import { Button } from "@nextui-org/react";
import { Session } from "next-auth";
import React from "react";
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    }, { notifyOnChangeProps: ["data"] });

    const handle = () => {
        fetch(`https://api.rina.place/api/friendship/${props.userID}`, {
            headers: {
                Authorization: "Bearer " + props.session!.user.accessToken
            },
            method: relationStatus == -1 ? "POST" : [0, 1].includes(relationStatus) ? "DELETE" : undefined
        }).then(resp => {
            if (resp.status === 200)
                refetch();
        });
    };

    if (isLoading) {
        return <Button isLoading={isLoading} isIconOnly={true} />;
    }

    if (relationStatus === -1) {
        return (
            <Button
                onClick={() => handle()}
                className="bg-content2 hover:bg-content3/60"
                startContent={<FaUser size={16} />}
                isIconOnly={true} />
        );
    }

    if (relationStatus === 0) {
        return (
            <Button
                onClick={() => handle()}
                className="osu-following hover:fuck-opacity"
                startContent={<FaUser size={16} />}
                isIconOnly={true} />
        );
    }

    return (
        <Button
            onClick={() => handle()}
            className="osu-mutual hover:fuck-opacity"
            startContent={<FaUserFriends size={16} />}
            isIconOnly={true} />
    );
}