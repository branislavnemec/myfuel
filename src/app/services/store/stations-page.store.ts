import { StationsPage } from '../../states/stations-page';
import { StoreService } from './store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class StationsPageStore extends StoreService<StationsPage> {

    protected store = 'stations-page';

    constructor() {
        super({
            loading: true,
            stations: [],
            searchInputValue: '',
            stationsFilter: {
                countryId: 'SK',
                fuelTypeId: 'xHNW2RWkOtIljYmfTMsg'
            },
        });
    }
}
