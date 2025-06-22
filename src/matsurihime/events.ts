import { MATSURIHIME_API } from ".";

export type MltdEvent = {
    id: number;
    type: number;
    appealType: number;
    name: string;
    schedule: {
        beginAt: Date;
        endAt: Date;
        pageOpendAt: Date;
        pageClosedAt: Date;
        boostBeginAt?: Date;
        boostEndAt?: Date;
    },
    item: {
        name?: string;
        shortName?: string;
    }
}

export async function fetchMltdEvents(): Promise<MltdEvent[]> {
    const response = await fetch(MATSURIHIME_API + "events?prettyPrint=false&orderBy=beginAt!");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const events = await response.json();
    
    return events.map((event: any) => ({
        ...event,
        schedule: {
            beginAt: new Date(event.schedule.beginAt),
            endAt: new Date(event.schedule.endAt),
            pageOpendAt: new Date(event.schedule.pageOpendAt),
            pageClosedAt: new Date(event.schedule.pageClosedAt),
            boostBeginAt: event.schedule.boostBeginAt ? new Date(event.schedule.boostBeginAt) : undefined,
            boostEndAt: event.schedule.boostEndAt ? new Date(event.schedule.boostEndAt) : undefined,
        }
    }));
}