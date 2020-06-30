import { StationEditDialogStore } from './store/station-edit-dialog.store';
import { StationFirestore } from './firestore/station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, catchError, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class StationService {

    constructor(
        private firestore: StationFirestore,
        private store: StationEditDialogStore
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
                    && !state.station
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
        this.store.patch({
            loading: true,
            formStatus: 'Saving...'
        }, 'station update');
        return this.firestore.update(station.id, station).then(
            (result) => {
                this.store.patch({
                    loading: false,
                    formStatus: 'Saved!'
                }, 'station update SUCCESS');
            }, 
            (err) => {
                this.store.patch({
                    loading: false,
                    formStatus: 'An error ocurred'
                }, 'station update ERROR');
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