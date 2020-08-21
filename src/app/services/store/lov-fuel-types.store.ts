import { StoreService } from './store.service';
import { Injectable } from '@angular/core';
import { LovFuelTypes } from 'src/app/states/lov-fuel-types';

@Injectable()
export class LovFuelTypesStore extends StoreService<LovFuelTypes> {

    protected store = 'lov-fuel-types';

    constructor() {
        super({
            loading: true,
            fuelTypes: [],
        });
    }
}
