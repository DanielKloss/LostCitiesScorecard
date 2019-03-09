import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageProvider } from 'src/providers/storageProvider';

import { PlayerGame } from '../models/playerGame';
import { Player } from '../models/player';

@Component({
    selector: 'app-stats',
    templateUrl: 'stats.page.html',
    styleUrls: ['stats.page.scss'],
})
export class StatsPage {

    storageProvider: StorageProvider;

    players: Array<Player>;
    games: Array<PlayerGame>;

    totalGames: number;
    mostWins: number;
    mostLosses: number;
    bestScore: number;
    worstScore: number;
    playersMostWins: Array<string>;
    playersMostLosses: Array<string>;
    playersBestScore: Array<string>;
    playersWorstScore: Array<string>;

    constructor(public navCtrl: NavController, private StorageProvider: StorageProvider) {
        this.storageProvider = StorageProvider

        this.getData().then(() => {
            this.populateData();
        });
    }

    getData(): any {
        return new Promise((resolve) => {
            this.players = new Array<Player>();
            this.games = new Array<PlayerGame>();

            this.storageProvider.getAllPlayers().then((resp: any) => {
                if (resp.length > 0) {
                    for (let i = 0; i < resp.length; i++) {
                        this.players.push(resp[i]);
                    }
                }
                resolve();
            })
        }).then(() => {
            return new Promise((resolve) => {
                this.storageProvider.getAllGames().then((resp: any) => {
                    if (resp.length > 0) {
                        for (let i = 0; i < resp.length; i++) {
                            this.games.push(resp[i]);
                        }
                    }
                    resolve();
                });
            })
        })
    }

    populateData() {
        this.totalGames = this.games.length;

        this.getScoreRecords();
        this.getWinRecords();
        this.getPlayerRecords();
    }

    getWinRecords() {
        this.mostWins = 0;
        this.mostLosses = 0;
        this.playersMostWins = new Array<string>();
        this.playersMostLosses = new Array<string>();

        for (var i = 0; i < this.players.length; i++) {
            let numberOfWins = this.games.filter(p => p.isWinner == true && p.playerName == this.players[i].name).length;

            if (numberOfWins > this.mostWins) {
                this.mostWins = numberOfWins;
                this.playersMostWins = new Array<string>(this.players[i].name);
            } else if (numberOfWins == this.mostWins) {
                this.playersMostWins.push(this.players[i].name);
            }

            let numberOfLosses = this.games.filter(p => p.isWinner == false && p.playerName == this.players[i].name).length;

            if (numberOfLosses > this.mostLosses) {
                this.mostLosses = numberOfLosses;
                this.playersMostLosses = new Array<string>(this.players[i].name);
            } else if (numberOfLosses == this.mostLosses && numberOfLosses != 0) {
                this.playersMostLosses.push(this.players[i].name);
            }
        }
    }

    getScoreRecords() {
        this.playersBestScore = new Array<string>();
        this.playersWorstScore = new Array<string>();

        this.games.sort((a, b) => (a.totalScore < b.totalScore) ? 1 : ((b.totalScore < a.totalScore) ? -1 : 0));

        this.bestScore = this.games[0].totalScore;
        this.worstScore = this.games[this.games.length - 1].totalScore;

        for (var i = 0; i < this.games.length; i++) {
            if (this.games[i].totalScore == this.bestScore && !this.playersBestScore.includes(this.games[i].playerName)) {
                this.playersBestScore.push(this.games[i].playerName);
            } else if (this.games[i].totalScore == this.worstScore && !this.playersWorstScore.includes(this.games[i].playerName)) {
                this.playersWorstScore.push(this.games[i].playerName);
            }
        }
    }

    getPlayerRecords() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].played = this.games.filter(g => g.playerName == this.players[i].name).length;
            this.players[i].wins = this.games.filter(g => g.playerName == this.players[i].name).filter(g => g.isWinner == true).length;
            this.players[i].losses = this.players[i].played - this.players[i].wins;
            this.players[i].winPercent = (this.players[i].wins / this.players[i].played) * 100;

            let totalScore = 0;

            this.games.filter(g => g.playerName == this.players[i].name).forEach(function (game) {
                totalScore += game.totalScore;
            })

            this.players[i].averageScore = totalScore / this.players[i].played;
        }
    }
}
