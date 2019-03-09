import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LaunchReview } from '@ionic-native/launch-review/ngx';

@Component({
    selector: 'app-about',
    templateUrl: 'about.page.html',
    styleUrls: ['about.page.scss'],
})
export class AboutPage {

    versionNumber: string;
    platformIsBrowser: boolean;

    constructor(private appVersion: AppVersion, private iab: InAppBrowser, public platform: Platform, public rate: LaunchReview) {
        if (this.platform.is('cordova')) {
            // You're on a device 
            appVersion.getVersionNumber().then(version => this.versionNumber = version);
            this.platformIsBrowser = false;
        } else {
            // You're testing in browser
            this.versionNumber = "Browser Version";
            this.platformIsBrowser = true;
        }
    }

    moreInfo() {
        this.iab.create('https://boardgamegeek.com/boardgame/50/lost-cities');
    }

    rateAndReview() {
        if (!this.platformIsBrowser) {
            if (this.rate.isRatingSupported()) {
                this.rate.rating().then(() => console.log('Successfully launched rating dialog'));
            }
        }
    }
}
