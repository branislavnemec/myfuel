/// <reference types="cordova-plugin-camera" />
declare global {
    var textocr: any;
}

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
    if (window) {
        window.console.log = () => {};
       }
}

const bootstrap = () => {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));

};

if (window['cordova'] !== undefined) {
    document.addEventListener('deviceready', () => {
        console.log('bootstrap device');
        bootstrap();
    }, false);
} else {
    bootstrap();
}

