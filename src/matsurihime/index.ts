
const MATSURIHIME_DOMAIN = "https://api.matsurihi.me";
export const MATSURIHIME_API = `${MATSURIHIME_DOMAIN}/api/mltd/v2/`;

export type MltdRankingType = "eventPoint" | "highScore" | "highScore2" | "highScoreTotal" | "loungePoint" | "idolPoint";

export const rankingType2Name = (type: MltdRankingType | null): string => {
    switch (type) {
        case "eventPoint":
            return "イベントpt";
        case "highScore":
            return "ハイスコア";
        case "highScore2":
            return "ハイスコア2";
        case "highScoreTotal":
            return "ハイスコア総合";
        case "loungePoint":
            return "ラウンジpt";
        case "idolPoint":
            return "アイドルpt";
        default:
            return "";
    }
}