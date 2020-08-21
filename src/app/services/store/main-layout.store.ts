import { StoreService } from './store.service';
import { Injectable } from '@angular/core';
import { MainLayout } from '../../states/main-layout';

@Injectable()
export class MainLayoutStore extends StoreService<MainLayout> {

    protected store = 'main-layout';

    constructor() {
        super({
            mainMenuItem: 'map',
            mainMenuVisible: true,
            title: 'Map'
        });
    }
}
