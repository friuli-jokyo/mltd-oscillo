import { MATSURIHIME_API } from ".";

export type MltdEventBorders = {
    eventPoint?: number[];
    highScore?: number[];
    highScore2?: number[];
    highScoreTotal?: number;
    loungePoint?: number[];
    idolPoint?: {
        idolId: number;
        borders: number[];
    }[]
}

export async function fetchBorders(eventId: number): Promise<MltdEventBorders> {
    const response = await fetch(MATSURIHIME_API + `events/${eventId}/rankings/borders?prettyPrint=false`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}
