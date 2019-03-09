import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StorageProvider } from 'src/providers/storageProvider';

import { Player } from 'src/app/models/player';

@Component({
    selector: 'app-start',
    templateUrl: 'start.page.html',
    styleUrls: ['start.page.scss'],
})
export class StartPage {
    storageProvider: StorageProvider;

    gameType: boolean;
    players: Array<Player>;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, private StorageProvider: StorageProvider) {
        this.gameType = false;
        this.storageProvider = StorageProvider
        this.getAllPlayers();
    }

    async addPlayer() {
        const alert = await this.alertCtrl.create({
            header: "Add Player",
            message: "Enter the name of the player you would like to add",
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'new player'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Add',
                    handler: (data) => {
                        if (data.name == undefined || data.name.trim() == "") {
                            this.presentAlert("Player Name", "", "Please enter a name for the new player");
                        }
                        else {
                            this.storageProvider.playerExists(data.name).then((resp: boolean) => {
                                if (!resp) {
                                    this.storageProvider.addPlayer(data.name).then(() => {
                                        this.players.push(new Player({ name: data.name, canBeSelected: true, selectedToPlay: false }))
                                        this.playerSelectedChanged();
                                    });
                                } else {
                                    this.presentAlert("Duplicate Player", "", "You already have a player with that name");
                                }
                            });
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    async editPlayer(nameToChange: string) {
        const alert = await this.alertCtrl.create({
            header: "Edit Player",
            message: "What would you like to change " + nameToChange + "'s name to?",
            inputs: [
                {
                    name: 'newName',
                    type: 'text',
                    placeholder: nameToChange
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        if (data.newName == undefined || data.newName == "") {
                            return;
                        }

                        this.storageProvider.playerExists(data.newName).then((resp: boolean) => {
                            if (!resp || data.newName.toLowerCase() == nameToChange.toLowerCase()) {
                                this.storageProvider.updatePlayer(nameToChange, data.newName)
                                this.players.find(p => p.name == nameToChange).name = data.newName;
                            } else {
                                this.presentAlert("Duplicate Player", "", "You already have a player with that name");
                            }
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    async deletePlayer(playerToDelete: string) {
        const alert = await this.alertCtrl.create({
            header: "Delete Player",
            message: "Are you sure you want to permanently delete " + playerToDelete + " and all of their data?",
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.storageProvider.deletePlayer(playerToDelete);
                        this.players.splice(this.players.findIndex(p => p.name == playerToDelete), 1);
                        this.playerSelectedChanged();
                    }
                }
            ]
        });

        await alert.present();
    }

    getAllPlayers() {
        this.players = new Array<Player>();
        this.storageProvider.getAllPlayers().then((resp: any) => {
            if (resp.length > 0) {
                for (let i = 0; i < resp.length; i++) {
                    let player = new Player({ name: resp[i].name, canBeSelected: true, selectedToPlay: false });
                    this.players.push(player);
                }
            }
        });
    }

    playerSelectedChanged() {
        if (this.players.filter(p => p.selectedToPlay).length == 2) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].canBeSelected = this.players[i].selectedToPlay;
            }
        } else {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].canBeSelected = true;
            }
        }
    }

    startGame() {
        let playersSelected = this.players.filter(p => p.selectedToPlay);

        if (playersSelected.length == 2) {
            this.navCtrl.navigateForward('/scoreboard/' + playersSelected[0].name + '/' + playersSelected[1].name + '/' + this.gameType);
        } else {
            this.presentAlert("2 Players Needed", "", "You must select two players to start a game");
        }
    }

    async presentAlert(header: string, subHeader: string, message: string) {
        const alert = await this.alertCtrl.create({
            header: header,
            subHeader: subHeader,
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }
}
