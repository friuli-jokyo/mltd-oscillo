import idols from "../assets/idols.json";

export type MltdIdol = {
    id: number;
    sortId: number;
    resourceId: string;
    type: number;
    fullName: string;
    lastName: string;
    firstName?: string;
    alphabetName: string;
    fullNameRuby: string;
    age?: number;
    birthplace: {
        id: number;
        name: string;
    };
    handednessType: {
        id: number;
        name: string;
    };
    height: number;
    weight: number;
    hobby: string;
    speciality: string;
    favorites: string;
    cv: string;
    colorCode: string;
    birthday: {
        month: number;
        day: number;
    };
    constellation: {
        id: number;
        name: string;
    };
    bloodType: {
        id: number;
        name: string;
    };
    measurements: {
        bust: number;
        waist: number;
        hip: number;
    };
}

export function mltdIdols(): MltdIdol[] {
    return idols as MltdIdol[];
} 