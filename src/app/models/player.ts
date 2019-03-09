export class Player {
    name: string;

    expeditions: Array<Expedition> = [];

    canBeSelected: boolean;
    selectedToPlay: boolean;

    totalScore: number;

    isWinner: boolean;

    played: number;
    wins: number;
    losses: number;
    winPercent: number;
    averageScore: number;

    public constructor(init?: Partial<Player>) {
        Object.assign(this, init);

        this.totalScore = 0;
        this.isWinner = false;

        var colours: { [id: number] : string; } = {};
        colours[1] = "red"
        colours[2] = "green"
        colours[3] = "white"
        colours[4] = "blue"
        colours[5] = "yellow"

        for (var i = 1; i < 6; i++) {
            let name = colours[i];
            this.expeditions.push(new Expedition(name));
        }
    }
}

export class Expedition {
    name: string;
    wagers: Array<number> = [];
    expeditionNumbers: Array<ExpeditionNumber> = [];
    totalScore: number;

    constructor(Name: string) {
        this.name = Name;

        for (var i = 2; i < 11; i++) {
            this.expeditionNumbers.push(new ExpeditionNumber(i));
        }

        this.totalScore = 0;
    }
}

class ExpeditionNumber {
    got: boolean;
    gone: boolean;
    number: number;

    constructor(Number: number) {
        this.got = false;
        this.gone = false;
        this.number = Number;
    }
}