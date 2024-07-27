export type ScoreType = {
    detail?: any;
    error?: string;

    id: number;
    user_id: number;
    title: string;
    artist: string;
    version: string;
    set_id: number;
    map_id: number;
    submitted: number;
    max_combo: number;
    mods: number;
    pp: number;
    score: number;
    accuracy: number;
    count_miss: number;
    count_50: number;
    count_100: number;
    count_300: number;
    count_geki: number;
    count_katu: number;
    rank: string;
    map_md5?: string;
    beatmap?: {
        map_id: number;
        set_id: number;
        title: string;
        artist: string;
        version: string;
        cs: number;
        ar: number;
        hp: number;
        od: number;
        creator: string;
        creator_id: number;
        mode: number;
        bpm: number;
        mods_diff: {
            stars: number;
            ar: number;
            od: number;
            cs: number;
            hp: number;
        };
    };
    viewers?: [{
        username: string;
        user_id: number;
        country: string;
        timestamp: number;
    }];
};