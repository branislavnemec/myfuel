import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class BackButtonService {

    onBackButton: () => void = this.defaultHandler;

    constructor(private location: Location) {
    }

    setCustomHandler(handler: () => void) {
        console.log('back button - set custom handler');
        this.onBackButton = handler;
    }

    resetDefaultHandler() {
        console.log('back button - reset default handler');
        this.onBackButton = this.defaultHandler;
    }

    private defaultHandler() {
        this.location.back();
    }

}
