import { StationEditDialogStore } from './station-edit-dialog.store';
import { StationFirestore } from './station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class StationService {

    constructor(
        private firestore: StationFirestore,
        private store: StationEditDialogStore
    ) {

    }

    get station$(): Observable<Station> {
        return this.store.state$.pipe(map(state => state.loading
            ? null
            : state.station));
    }

    get loading$(): Observable<boolean> {
        return this.store.state$.pipe(map(state => state.loading));
    }

    get noResult$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => {
                return !state.loading
                    && !state.station
            })
        );
    }

    get formStatus$(): Observable<string> {
        return this.store.state$.pipe(map(state => state.formStatus));
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
        return this.firestore.doc$(id).pipe(
            tap(station => {
                this.store.patch({
                    station,        
                }, `station load`);
            })
            );
    }

}