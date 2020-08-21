import { MapPage } from '../../states/map-page';
import { StoreService } from './store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MapPageStore extends StoreService<MapPage> {

    protected store = 'map-page';

    constructor() {
        super({
            stations: [],
            mapFilter: {
                range: 5,
                fuelTypeId: 'xHNW2RWkOtIljYmfTMsg'
            },
            mapCenter: null,
            mapZoom: 14,
            position: null,
            circleDraggable: false
        });
    }
}
