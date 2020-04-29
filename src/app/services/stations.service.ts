import { StationsPageStore } from './store/stations-page.store';
import { StationFirestore } from './firestore/station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';

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

    create(station: Station) {
        this.store.patch({
            loading: true,
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
        this.store.patch({ loading: true }, "station delete");
        return this.firestore.delete(id).catch(err => {
            this.store.patch({
                loading: false,
                formStatus: 'An error ocurred'
            }, "station delete ERROR");
        });
    }
}