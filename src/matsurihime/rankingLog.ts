import { MATSURIHIME_API, MltdRankingType } from ".";

export type RankingLog = {
    rank: number;
    data: {
        score: number;
        aggregatedAt: Date;
    }[];
}

const RANK_COUNT_MAX = 20;

function splitRanks(ranks: number[]): number[][] {
    const rankChunks: number[][] = [];
    for (let i = 0; i < ranks.length; i += RANK_COUNT_MAX) {
        rankChunks.push(ranks.slice(i, i + RANK_COUNT_MAX));
    }
    return rankChunks;
}

export function splitRanges(ranges: string): number[] {
    const ranges_splited = ranges.split(",");
    const result: number[] = [];
    for (const range of ranges_splited) {
        if (range.includes("-")) {
            let [start, end] = range.split("-").map(Number);
            if (start > end) {
                [start, end] = [end, start];
            }
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
        } else {
            result.push(Number(range));
        }
    }
    return result;
}

export async function fetchRankingLog(eventId: number, eventType: MltdRankingType, ranks: number[], since?: Date): Promise<RankingLog[]> {
    const ranks_splited = splitRanks(ranks);
    let result: RankingLog[] = [];
    
    const responses = await Promise.all(ranks_splited.map((rankChunk) =>
        fetch(MATSURIHIME_API + `events/${eventId}/rankings/${eventType}/logs/${rankChunk.join(",")}?prettyPrint=false` + (since ? `&since=${since.toISOString()}` : ""))
    ));
    
    const dataPromises = responses.map(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const logs = await response.json();
        return logs.map((log: any) => ({
            rank: log.rank,
            data: log.data.map((item: any) => ({
                score: item.score,
                aggregatedAt: new Date(item.aggregatedAt)
            }))
        }));
    });
    
    const allData = await Promise.all(dataPromises);
    allData.forEach(logs => {
        result = result.concat(logs);
    });
    
    return result;
}

export async function fetchIdolRankingLog(eventId: number, idolId: number, ranks: number[], all: boolean, since?: Date): Promise<RankingLog[]> {
    const ranks_splited = splitRanks(ranks);
    let result: RankingLog[] = [];
    
    const responses = await Promise.all(ranks_splited.map((rankChunk) =>
        fetch(MATSURIHIME_API + `events/${eventId}/rankings/idolPoint/${idolId}/logs/${rankChunk.join(",")}?prettyPrint=false&all=${all}` + (since ? `&since=${since.toISOString()}` : ""))
    ));
    
    const dataPromises = responses.map(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const logs = await response.json();
        return logs.map((log: any) => ({
            rank: log.rank,
            data: log.data.map((item: any) => ({
                score: item.score,
                aggregatedAt: new Date(item.aggregatedAt)
            }))
        }));
    });
    
    const allData = await Promise.all(dataPromises);
    allData.forEach(logs => {
        result = result.concat(logs);
    });
    
    return result;
}