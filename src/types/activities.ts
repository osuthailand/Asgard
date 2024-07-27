export type RecentActivities = {
    detail?: any,
    error?: string,

    id: number,
    timestamp: number,

    activity: string;
    map_id: number;
    set_id: number;
    title: string;
    artist: string;
    version: string;
};
