import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Player } from 'src/app/models/player';
import { Datetime } from "@ionic/angular";
import { PlayerGame } from 'src/app/models/playerGame';

@Injectable()
export class StorageProvider {
    storage: Storage;

    constructor(Storage: Storage) {
        this.storage = Storage;
    }

    getAllPlayers(): any {
        return new Promise((resolve, reject) => {
            this.storage.get("players").then((data) => {
                if (data != null && data != undefined) {
                    resolve(data);
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    deletePlayer(playerToDelete: string) {
        return new Promise((resolve, reject) => {
            this.storage.get("players").then((data) => {
                if (data != null && data != undefined) {
                    let players: Array<Player> = data;
                    let indexToDelete = players.findIndex(p => p.name == playerToDelete);
                    players.splice(indexToDelete, 1);
                    this.storage.set("players", players);
                    resolve();
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    updatePlayer(nameToChange: string, newName: any) {
        return new Promise((resolve, reject) => {
            this.storage.get("players").then((data) => {
                if (data != null && data != undefined) {
                    let players: Array<Player> = data;
                    let indexToChange = players.findIndex(p => p.name == nameToChange);
                    players[indexToChange].name = newName;
                    this.storage.set("players", players);
                    resolve();
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    addPlayer(playerToAdd: string) {
        return new Promise((resolve, reject) => {
            this.storage.get("players").then((data) => {
                if (data != null && data != undefined) {
                    let players: Array<Player> = data;
                    players.push(new Player({ name: playerToAdd }));
                    this.storage.set("players", players);
                    resolve();
                } else {
                    this.storage.set("players", new Array<Player>(new Player({ name: playerToAdd })));
                    resolve();
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    playerExists(playerToAdd: string) {
        return new Promise((resolve, reject) => {
            this.storage.get("players").then((data) => {
                if (data != null && data != undefined) {
                    let players: Array<Player> = data;
                    if (players.filter(p => p.name.toLowerCase() == playerToAdd.toLowerCase()).length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    addGame(players: Array<Player>) {
        let dateTime = new Date().toISOString();

        return new Promise((resolve, reject) => {
            this.storage.get("games").then((data) => {
                if (data != null && data != undefined) {
                    let games: Array<PlayerGame> = data;

                    for (var i = 0; i < players.length; i++) {
                        games.push(new PlayerGame({ playerName: players[i].name, dateTime: dateTime, isWinner: players[i].isWinner, totalScore: players[i].totalScore }));
                    }

                    this.storage.set("games", games);
                    resolve(dateTime);
                } else {
                    let games: Array<PlayerGame> = new Array<PlayerGame>();

                    for (var i = 0; i < players.length; i++) {
                        games.push(new PlayerGame({ playerName: players[i].name, dateTime: dateTime, isWinner: players[i].isWinner, totalScore: players[i].totalScore }));
                    }

                    this.storage.set("games", games);
                    resolve(dateTime);
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    getScoreboardGames(dateTime: string): any {
        return new Promise((resolve, reject) => {
            this.storage.get("games").then((data) => {
                if (data != null && data != undefined) {
                    let games: Array<PlayerGame> = data;
                    resolve(games.filter(g => g.dateTime.toString() == dateTime.toString()))
                }
            }).catch((err) => { reject(err); console.log(err); });
        });
    }

    getAllGames(): any {
        return new Promise((resolve, reject) => {
            this.storage.get("games").then((data) => {
                resolve(data);
            }).catch((err) => { reject(err); console.log(err); });
        });
    }
}