import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { StorageProvider } from 'src/providers/storageProvider';

import { PlayerGame } from 'src/app/models/playerGame';

@Component({
    selector: 'app-standings',
    templateUrl: 'standings.page.html',
    styleUrls: ['standings.page.scss'],
})
export class StandingsPage {
    storageProvider: StorageProvider;

    dateTime: string;
    games: Array<PlayerGame> = [];
    winners: Array<PlayerGame> = [];

    subscription: any;

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
            this.navCtrl.navigateForward("home")
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    constructor(public navCtrl: NavController, private route: ActivatedRoute, private StorageProvider: StorageProvider, private platform: Platform) {
        this.storageProvider = StorageProvider;

        let dateTimeParameter = this.route.snapshot.paramMap.get("dt");

        this.dateTime = dateTimeParameter;

        this.storageProvider.getScoreboardGames(dateTimeParameter).then((resp) => {
            if (resp.length > 0) {
                for (var i = 0; i < resp.length; i++) {
                    this.games.push(new PlayerGame({ playerName: resp[i].playerName, totalScore: resp[i].totalScore, isWinner: resp[i].isWinner }))
                }
                this.games.sort((a, b) => (a.totalScore < b.totalScore) ? 1 : ((b.totalScore < a.totalScore) ? -1 : 0));

                this.winners = this.games.filter(g => g.isWinner == true);

                for (var i = 0; i < this.winners.length; i++) {
                    this.games.splice(this.games.findIndex(g => g.playerName == this.winners[i].playerName), 1);
                }
            }
        });
    }

    backToMainMenu() {
        this.navCtrl.navigateForward('/home');
    }
}
