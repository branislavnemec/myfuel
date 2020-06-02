import { StoreService } from './store.service';
import { Injectable } from '@angular/core';
import { LovCountries } from 'src/app/states/lov-countries';

@Injectable()
export class LovCountriesStore extends StoreService<LovCountries> {

    protected store: string = 'lov-countries';

    constructor() {
        super({
            loading: true,
            countries: [],
        });
    }
}