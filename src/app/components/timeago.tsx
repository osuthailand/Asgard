"use client";

import TimeAgo from "react-timeago";

export default function WrappedTimeago(props: {
    timestamp: number;
}) {
    return <TimeAgo date={props.timestamp * 1000} className="text-default-600" />;
}