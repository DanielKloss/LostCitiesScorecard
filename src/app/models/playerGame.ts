import { Datetime } from "@ionic/angular";

export class PlayerGame {
    playerName: string;
    dateTime: string;
    totalScore: number;
    isWinner: boolean;

    public constructor(init?: Partial<PlayerGame>) {
        Object.assign(this, init);
    }
}