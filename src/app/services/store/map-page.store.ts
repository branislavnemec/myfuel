import { MapPage } from '../../states/map-page';
import { StoreService } from './store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MapPageStore extends StoreService<MapPage> {

    protected store: string = 'map-page';

    constructor() {
        super({
            stations: [],
            mapFilter: {
                range: 5
            },
            mapCenter: null,
            mapZoom: 15,
            position: null,
            circleDraggable: false
        });
    }
}