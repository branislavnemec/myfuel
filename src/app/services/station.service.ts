import { StationEditDialogStore } from './store/station-edit-dialog.store';
import { StationFirestore } from './firestore/station.firestore';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, catchError, distinctUntilChanged } from 'rxjs/operators';
import { IndexedDBService } from '../utils/indexed-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Activity } from '../utils/activities';
import { environment } from 'src/environments/environment';

@Injectable()
export class StationService {

    constructor(
        private firestore: StationFirestore,
        private store: StationEditDialogStore,
        private indexedDBService: IndexedDBService,
        private matSnackBar: MatSnackBar,
        private ngZone: NgZone
    ) {

    }

    get station$(): Observable<Station> {
        return this.store.state$.pipe(
            map(state => state.station),
            distinctUntilChanged()
        );
    }

    get loading$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => state.loading),
            distinctUntilChanged()
        );
    }

    get noResult$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => {
                return !state.loading
                    && !state.station;
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

    update(station: Station) {
        return this.indexedDBService.isActivityAllowed(Activity.UPDATE_STATION,
            environment.activityLimits.updateStation.maxAttempts,
            environment.activityLimits.updateStation.period).then(
            (result) => {
                return this.ngZone.run(() => {
                    console.log(result);
                    if (result) {
                        this.store.patch({
                            loading: true,
                            formStatus: 'Saving...'
                        }, 'station update');
                        return this.firestore.update(station.id, station).then(
                            (res) => {
                                this.store.patch({
                                    loading: false,
                                    formStatus: 'Saved!'
                                }, 'station update SUCCESS');
                                this.indexedDBService.logActivity(Activity.UPDATE_STATION, environment.activityLimits.updateStation.maxAttempts);
                            },
                            (err) => {
                                this.store.patch({
                                    loading: false,
                                    formStatus: 'An error ocurred'
                                }, 'station update ERROR');
                            }
                        );
                    } else {
                        this.matSnackBar.open('Edit station daily limit exceeded', null, {
                            duration: 3000,
                        });
                        return Promise.reject();
                    }
                });
            }
        );
    }

    loadStation(id: string) {
        this.store.patch({
            loading: true,
            formStatus: 'Loading...'
        }, 'station load');
        return this.firestore.doc$(id).pipe(
            tap(station => {
                this.store.patch({
                    loading: false,
                    station,
                    formStatus: ''
                }, 'station load SUCCESS');
            }),
            catchError((err) => {
                this.store.patch({
                    loading: false,
                    formStatus: 'An error ocurred'
                }, 'station load ERROR');
                throw err;
            })
        );
    }

}
