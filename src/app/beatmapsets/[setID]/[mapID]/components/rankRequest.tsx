"use client";

import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaTimes } from "react-icons/fa";

export function RankRequestButton({ setID }: { setID: number }) {
    const { data: session } = useSession();
    const [requestStatus, setRequestStatus] = useState<string>("none");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (session?.user.accessToken) {
            checkRequestStatus();
        }
    }, [session, setID]);

    const checkRequestStatus = async () => {
        if (!session?.user.accessToken) return;

        try {
            const response = await fetch(
                `https://api.rina.place/api/beatmap/rank-request/${setID}/status`,
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setRequestStatus(data.status || "none");
            }
        } catch (error) {
            console.error("Failed to check request status", error);
        }
    };

    const handleRankRequest = async () => {
        if (!session?.user.accessToken) return;

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `https://api.rina.place/api/beatmap/rank-request/${setID}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Rank request submitted successfully!");
                setRequestStatus("pending");
            } else {
                setMessage(data.error || "Failed to submit rank request");
            }
        } catch (error) {
            setMessage("Error submitting rank request");
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    if (!session) {
        return null;
    }

    const getStatusButton = () => {
        switch (requestStatus) {
            case "pending":
                return (
                    <Button
                        isDisabled
                        className="px-5 h-9 rounded-full bg-yellow-600/60"
                        startContent={<FaClock />}
                    >
                        Request Pending
                    </Button>
                );
            case "approved":
                return (
                    <Button
                        isDisabled
                        className="px-5 h-9 rounded-full bg-green-600/60"
                        startContent={<FaCheckCircle />}
                    >
                        Ranked
                    </Button>
                );
            case "rejected":
                return (
                    <Button
                        isDisabled
                        className="px-5 h-9 rounded-full bg-red-600/60"
                        startContent={<FaTimes />}
                    >
                        Request Rejected
                    </Button>
                );
            default:
                return (
                    <Button
                        isLoading={isLoading}
                        onClick={handleRankRequest}
                        className="px-5 h-9 rounded-full bg-purple-600/60 shadow-md hover:bg-purple-600/90"
                    >
                        Request Rank
                    </Button>
                );
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {getStatusButton()}
            {message && (
                <p className="text-sm text-center text-default-500">{message}</p>
            )}
        </div>
    );
}
