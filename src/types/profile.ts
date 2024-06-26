export type UserProfileData = {
    error?: string;
    detail?: any;

    username: string,
    id: number,
    registered_time: number,
    latest_activity_time: number,
    country: string,
    privileges: number,
    userpage_content: string,
    preferred_gamemode: number,
    preferred_mode: number,
    is_verified: boolean,
    playstyles: number,
    clan: {
        id?: number,
        name?: string,
        tag?: string,
        icon?: string,
    },
    name_history: [{
        changed_from?: string,
        changed_username?: string,
        date?: number;
    }];
};