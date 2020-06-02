import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { CountryFirestore } from './firestore/country.firestore';
import { LovCountriesStore } from './store/lov-countries.store';
import { Country } from '../models/country';

@Injectable()
export class CountriesService {

    constructor(
        private firestore: CountryFirestore,
        private store: LovCountriesStore) {

        this.firestore.collection$().pipe(
            tap(countries => {
                this.store.patch({
                    loading: false,
                    countries,        
                }, 'countries collection subscription');
            })
        ).subscribe();

    }

    get countries$(): Observable<Country[]> {
        return this.store.state$.pipe(
            map(state => state.countries),
            distinctUntilChanged()
        );
    }

    get loading$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => state.loading),
            distinctUntilChanged()
        );
    }

    get noResults$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => {
                return !state.loading
                    && state.countries
                    && state.countries.length === 0
            }),
            distinctUntilChanged()
        );
    }

}