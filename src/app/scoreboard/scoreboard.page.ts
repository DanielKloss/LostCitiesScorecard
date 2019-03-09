import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { StorageProvider } from 'src/providers/storageProvider';

import { Player, Expedition } from 'src/app/models/player';

@Component({
    selector: 'app-scoreboard',
    templateUrl: 'scoreboard.page.html',
    styleUrls: ['scoreboard.page.scss'],
})
export class ScoreboardPage {
    storageProvider: StorageProvider;

    round: number;
    gameType: boolean;
    players: Array<Player> = [];

    subscription: any;

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribeWithPriority(1, async () => {
            const alert = await this.alertCtrl.create({
                header: "Quit Game",
                message: "Are you sure you want to quit the game without saving?",
                buttons: [
                    {
                        text: "OK",
                        handler: () => { this.navCtrl.navigateForward("home") }
                    },
                    {
                        text: "Cancel",
                        handler: () => { console.log("cancelled") }
                    }
                ]
            })

            await alert.present();
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    constructor(public navCtrl: NavController, private route: ActivatedRoute, public platform: Platform, private StorageProvider: StorageProvider, private alertCtrl: AlertController) {
        this.storageProvider = StorageProvider;

        if (this.route.snapshot.paramMap.get("gt") == "true") {
            this.gameType = true;
        } else {
            this.gameType = false;
        }

        this.round = 1;

        this.players.push(new Player({ name: this.route.snapshot.paramMap.get("p1") }));
        this.players.push(new Player({ name: this.route.snapshot.paramMap.get("p2") }));
    }

    changeWager(expedition: Expedition) {
        let totalWagers = 0;

        for (var i = 0; i < this.players.length; i++) {
            totalWagers += this.players[i].expeditions.find(e => e.name == expedition.name).wagers.length;
        }

        if (totalWagers == 3) {
            expedition.wagers = [];
        } else {
            expedition.wagers.push(0);
        }
        this.workOutScore(expedition);
    }

    updateExpeditionNumbers(expedition: Expedition, expeditionName: string, expeditionNumber: number, player: Player) {
        player.expeditions.find(e => e.name == expeditionName).expeditionNumbers[expeditionNumber - 2].got = !player.expeditions.find(e => e.name == expeditionName).expeditionNumbers[expeditionNumber - 2].got;
        this.players.find(p => p.name != player.name).expeditions.find(e => e.name == expeditionName).expeditionNumbers[expeditionNumber - 2].gone = !this.players.find(p => p.name != player.name).expeditions.find(e => e.name == expeditionName).expeditionNumbers[expeditionNumber - 2].gone;
        this.workOutScore(expedition);
    }

    workOutScore(expedition: Expedition) {
        var totalScore = 0;
        var expeditionNumbersGot = expedition.expeditionNumbers.filter(e => e.got == true).length;

        for (var i = 0; i < expedition.expeditionNumbers.length; i++) {
            if (expedition.expeditionNumbers[i].got) {
                totalScore += expedition.expeditionNumbers[i].number;
            }
        }

        if (expeditionNumbersGot > 0 || expedition.wagers.length > 0) {
            totalScore -= 20;
        }

        totalScore *= (expedition.wagers.length + 1);

        if (expeditionNumbersGot >= 8) {
            totalScore += 20;
        }

        expedition.totalScore = totalScore;
    }

    nextRound() {
        this.players.forEach(function (player) {
            player.expeditions.forEach(function (expedition) {
                player.totalScore += expedition.totalScore;
                expedition.wagers = [];
                expedition.totalScore = 0;
                expedition.expeditionNumbers.forEach(function (expoNumber) {
                    expoNumber.gone = false;
                    expoNumber.got = false;
                });
            });
        });

        this.round += 1;
    }

    endGame() {
        this.players.forEach(function (player) {
            player.expeditions.forEach(function (expedition) {
                player.totalScore += expedition.totalScore;
            });
        });

        this.players.sort((a, b) => (a.totalScore < b.totalScore) ? 1 : ((b.totalScore < a.totalScore) ? -1 : 0));
        let winningScore = this.players[0].totalScore;

        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].totalScore == winningScore) {
                this.players[i].isWinner = true;
            }
        }

        this.storageProvider.addGame(this.players).then((dateTime) => {
            this.navCtrl.navigateForward('/standings/' + dateTime);
        });
    }
}


