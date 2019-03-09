import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    menuItems: Array<string>;
    subscription: any;

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    constructor(public navCtrl: NavController, private platform: Platform) {
        this.menuItems = [
            "Start",
            "Stats",
            "Rules",
            "About"
        ];
    }

    openPage(item) {
        this.navCtrl.navigateForward('/' + item.toLowerCase());
    }
}
