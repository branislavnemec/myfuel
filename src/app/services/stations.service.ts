import { StationsPageStore } from './store/stations-page.store';
import { StationFirestore } from './firestore/station.firestore';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StationsFilter } from '../models/stations-filter';
import { IndexedDBService } from '../utils/indexed-db.service';
import { Activity } from '../utils/activities';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class StationsService {

    constructor(
        private firestore: StationFirestore,
        private store: StationsPageStore,
        private indexedDBService: IndexedDBService,
        private matSnackBar: MatSnackBar,
        private ngZone: NgZone
    ) {
        this.searchInputValue$.pipe(
            switchMap((searchInputValue: string) => {
                return this.stationsFilter$.pipe(
                    switchMap((stationsFilter: StationsFilter) => {
                        return this.firestore.collection$(ref => {
                            return ref
                                    .where('address.country', '==', stationsFilter.countryId)
                                    .where('prices.' + stationsFilter.fuelTypeId + '.price', '>=', 0)
                                    .where('keywords', 'array-contains', searchInputValue.toLowerCase())
                                    .orderBy('prices.' + stationsFilter.fuelTypeId + '.price')
                                    .limit(20);
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
                    && state.stations.length === 0;
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
        this.indexedDBService.isActivityAllowed(Activity.CREATE_NEW_STATION,
            environment.activityLimits.createNewStation.maxAttempts,
            environment.activityLimits.createNewStation.period).then(
            (result) => {
                this.ngZone.run(() => {
                    console.log(result);
                    if (result) {
                        this.store.patch({
                            loading: true,
                            formStatus: 'Saving...'
                        }, 'station create');
                        return this.firestore.create(station).then(() => {
                            this.store.patch({
                                loading: false,
                                formStatus: 'Saved!'
                            }, 'station create SUCCESS');
                            this.indexedDBService.logActivity(Activity.CREATE_NEW_STATION, environment.activityLimits.createNewStation.maxAttempts);
                            setTimeout(() => this.store.patch({
                                formStatus: ''
                            }, 'station create timeout reset formStatus'), 2000);
                        }).catch(err => {
                            this.store.patch({
                                loading: false,
                                formStatus: 'An error ocurred'
                            }, 'station create ERROR');
                        });
                    } else {
                        this.matSnackBar.open('Create new station daily limit exceeded', null, {
                            duration: 3000,
                        });
                    }
                });
            }
        );
    }

    delete(id: string) {
        this.indexedDBService.isActivityAllowed(Activity.DELETE_STATION,
            environment.activityLimits.deleteStation.maxAttempts,
            environment.activityLimits.deleteStation.period).then(
            (result) => {
                this.ngZone.run(() => {
                    console.log(result);
                    if (result) {
                        this.store.patch({
                            loading: true
                        }, 'station delete');
                        return this.firestore.delete(id).then(() => {
                            this.store.patch({
                                loading: false,
                            }, 'station delete SUCCESS');
                            this.indexedDBService.logActivity(Activity.DELETE_STATION, environment.activityLimits.deleteStation.maxAttempts);
                        }).catch(err => {
                            this.store.patch({
                                loading: false
                            }, 'station delete ERROR');
                        });
                    } else {
                        this.matSnackBar.open('Delete station daily limit exceeded', null, {
                            duration: 3000,
                        });
                    }
                });
            }
        );
    }

    setSearchInputValue(value: string) {
        this.store.patch({ searchInputValue: value }, 'search input set');
    }

    setStationsFilter(stationsFil: StationsFilter) {
        if (this.store.previous.stationsFilter.countryId === stationsFil.countryId &&
            this.store.previous.stationsFilter.fuelTypeId === stationsFil.fuelTypeId) {
                // do not patch the store

            } else {
                this.store.patch({
                    loading: true,
                    stations: [],
                    stationsFilter: stationsFil
                }, 'stations filter set');
            }
    }

}
