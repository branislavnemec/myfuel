import { StationsPageStore } from './store/stations-page.store';
import { StationFirestore } from './firestore/station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StationsFilter } from '../models/stations-filter';

@Injectable()
export class StationsService {

    constructor(
        private firestore: StationFirestore,
        private store: StationsPageStore
    ) {
        this.searchInputValue$.pipe(
            switchMap((searchInputValue: string) => {
                return this.stationsFilter$.pipe(
                    switchMap((stationsFilter: StationsFilter) => {
                        return this.firestore.collection$(ref => {
                            return ref
                                    .where('address.country', '==', stationsFilter.countryId)
                                    .where('prices.' + stationsFilter.fuelTypeId + '.price', '>', 0)
                                    .where('keywords', 'array-contains', searchInputValue.toLowerCase())
                                    .orderBy('prices.' + stationsFilter.fuelTypeId + '.price')
                                    .limit(50);
                        }).pipe(
                            tap(stations => {
                                this.store.patch({
                                    loading: false,
                                    stations,
                                }, 'stations collection subscription');
                            })
                        );
                    })
                );
            })
        ).subscribe();
    }

    get stations$(): Observable<Station[]> {
        return this.store.state$.pipe(
            map(state => state.stations),
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
                    && state.stations
                    && state.stations.length === 0
            }),
            distinctUntilChanged()
        );
    }

    get formStatus$(): Observable<string> {
        return this.store.state$.pipe(
            map(state => state.formStatus),
            distinctUntilChanged()
        );
    }

    get searchInputValue$(): Observable<string> {
        return this.store.state$.pipe(
            map(state => state.searchInputValue),
            distinctUntilChanged()
        );
    }

    get stationsFilter$(): Observable<StationsFilter> {
        return this.store.state$.pipe(
            map(state => state.stationsFilter),
            distinctUntilChanged((prev, curr) => prev.countryId === curr.countryId && prev.fuelTypeId === curr.fuelTypeId),
        );
    }

    create(station: Station) {
        this.store.patch({
            loading: true,
            formStatus: 'Saving...'
        }, 'station create');
        return this.firestore.create(station).then(() => {
            this.store.patch({
                formStatus: 'Saved!'
            }, 'station create SUCCESS');
            setTimeout(() => this.store.patch({
                formStatus: ''
            }, 'station create timeout reset formStatus'), 2000);
        }).catch(err => {
            this.store.patch({
                loading: false,
                formStatus: 'An error ocurred'
            }, 'station create ERROR');
        });
    }

    delete(id: string): any {
        this.store.patch({ loading: true }, 'station delete');
        return this.firestore.delete(id).catch(err => {
            this.store.patch({
                loading: false,
                formStatus: 'An error ocurred'
            }, 'station delete ERROR');
        });
    }

    setSearchInputValue(value: string) {
        this.store.patch({ searchInputValue: value }, 'search input set');
    }

    setStationsFilter(stationsFilter: StationsFilter) {
        if (this.store.previous.stationsFilter.countryId === stationsFilter.countryId &&
            this.store.previous.stationsFilter.fuelTypeId === stationsFilter.fuelTypeId) {
                // do not patch the store

            } else {
                this.store.patch({
                    loading: true,
                    stations: [],
                    stationsFilter: stationsFilter
                }, 'stations filter set');
            }
    }

}