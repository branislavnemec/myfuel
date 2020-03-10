import { StationsPageStore } from './stations-page.store';
import { StationFirestore } from './station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map } from 'rxjs/operators';
import { MapPageStore } from './map-page.store';

@Injectable()
export class MapService {

    constructor(
        private firestore: StationFirestore,
        private store: MapPageStore
    ) {
        this.firestore.collection$().pipe(
            tap(stations => {
                this.store.patch({
                    stations,        
                }, `stations collection subscription`);
            })
        ).subscribe();
    }

    get stations$(): Observable<Station[]> {
        return this.store.state$.pipe(map(state => state.stations));
    }

    create(station: Station) {
        this.store.patch({
            stations: [],
        }, "station create");
        return this.firestore.create(station).then(_ => {
            this.store.patch({
            }, "station create SUCCESS");
        }).catch(err => {
            this.store.patch({
            }, "station create ERROR");
        });
    }

    delete(id: string): any {
        this.store.patch({ stations: [] }, "station delete");
        return this.firestore.delete(id).catch(err => {
            this.store.patch({
            }, "station delete ERROR");
        });
    }
}