import { Component } from '@angular/core';
import { NavController, Slides } from '@ionic/angular';

@Component({
    selector: 'app-rules',
    templateUrl: 'rules.page.html',
    styleUrls: ['rules.page.scss'],
})
export class RulesPage {

    rulesCategories: Array<RulesCategory>;

    constructor(public navCtrl: NavController) {
        this.rulesCategories = [
            new RulesCategory("Setup", [
                "Place the game board between the two players",
                "Deal 8 cards to each player",
                "Organise the remaining cards into a draw pile face down next to the game board"
            ]),
            new RulesCategory("Gameplay", [
                "The oldest player begins",
                "Players place a card - either in one of their own columns or as a discard",
                "Players draw a card - either from the draw deck or from one of the discard piles",
                "Cards must be placed sequentially",
                "The game ends when the last card is drawn from the draw deck"
            ]),
            new RulesCategory("Scoring", [
                "Each player scores their placed cards and minuses 20 from each column with at least one card in it",
                "If one, two or three wager cards were placed at the beginning of a column, multiply the result by 2, 3 or 4 respectively",
                "Columns can earn negative points",
                "If a column has 8 or more cards placed in it that player scores a bonus 20 points"
            ])
        ];

        for (var i = 0; i < this.rulesCategories.length; i++) {
            if (i != this.rulesCategories.length - 1) {
                this.rulesCategories[i].nextRulesCategory = this.rulesCategories[i + 1].header;
            }
        }
    }
}

export class RulesCategory {
    header: string;
    nextRulesCategory: string;
    instructions: Array<string>;

    constructor(public Header: string, public Instructions: Array<string>) {
        this.header = Header;
        this.instructions = Instructions;
    }
}
