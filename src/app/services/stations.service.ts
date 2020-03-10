import { StationsPageStore } from './stations-page.store';
import { StationFirestore } from './station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class StationsService {

    constructor(
        private firestore: StationFirestore,
        private store: StationsPageStore
    ) {
        this.firestore.collection$().pipe(
            tap(stations => {
                this.store.patch({
                    loading: false,
                    stations,        
                }, `stations collection subscription`);
            })
        ).subscribe();
    }

    get stations$(): Observable<Station[]> {
        return this.store.state$.pipe(map(state => state.loading
            ? []
            : state.stations));
    }

    get loading$(): Observable<boolean> {
        return this.store.state$.pipe(map(state => state.loading));
    }

    get noResults$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => {
                return !state.loading
                    && state.stations
                    && state.stations.length === 0
            })
        );
    }

    get formStatus$(): Observable<string> {
        return this.store.state$.pipe(map(state => state.formStatus));
    }

    create(station: Station) {
        this.store.patch({
            loading: true,
            stations: [],
            formStatus: 'Saving...'
        }, "station create");
        return this.firestore.create(station).then(_ => {
            this.store.patch({
                formStatus: 'Saved!'
            }, "station create SUCCESS");
            setTimeout(() => this.store.patch({
                formStatus: ''
            }, "station create timeout reset formStatus"), 2000);
        }).catch(err => {
            this.store.patch({
                loading: false,
                formStatus: 'An error ocurred'
            }, "station create ERROR");
        });
    }

    delete(id: string): any {
        this.store.patch({ loading: true, stations: [] }, "station delete");
        return this.firestore.delete(id).catch(err => {
            this.store.patch({
                loading: false,
                formStatus: 'An error ocurred'
            }, "station delete ERROR");
        });
    }
}