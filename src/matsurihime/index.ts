import { MltdEventBorders } from "./borders";

const MATSURIHIME_DOMAIN = "https://api.matsurihi.me";
export const MATSURIHIME_API = `${MATSURIHIME_DOMAIN}/api/mltd/v2/`;

export type MltdRankingType = keyof MltdEventBorders;

export const rankingType2Name = (type: MltdRankingType | null): string => {
    switch (type) {
        case "eventPoint":
            return "個人イベントポイント";
        case "highScore":
            return "ハイスコア";
        case "highScore2":
            return "ハイスコア2";
        case "highScoreTotal":
            return "ハイスコア合計";
        case "loungePoint":
            return "ラウンジポイント";
        case "idolPoint":
            return "アイドルポイント";
        default:
            return "";
    }
}