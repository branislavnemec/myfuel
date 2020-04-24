import { StationFirestore } from './station.firestore';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { MapPageStore } from './map-page.store';
import { MapFilter } from '../models/map-filter';
import { switchMap } from 'rxjs/operators';
import { GeoUtils } from '../utils/geo-utils';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';

@Injectable()
export class MapService {

    geo: geofirex.GeoFireClient = geofirex.init(firebase);

    constructor(
        private firestore: StationFirestore,
        private store: MapPageStore
    ) {
        this.position$.pipe(
            switchMap((position: google.maps.LatLngLiteral) => {
                if (!position) { return new Observable(null); }
                return this.mapFilter$.pipe(
                    switchMap((mapFilter: MapFilter) => {
                        return this.firestore.geoCollection$(this.geo.point(position.lat, position.lng), mapFilter.range, 'position').pipe(
                            tap((stations) => {
                                this.store.patch({
                                    stations,        
                                }, 'map stations collection subscription');
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

    get mapFilter$(): Observable<MapFilter> {
        return this.store.state$.pipe(
            map(state => state.mapFilter),
            distinctUntilChanged()
        );
    }

    get mapCenter$(): Observable<google.maps.LatLngLiteral> {
        return this.store.state$.pipe(
            map(state => state.mapCenter),
            distinctUntilChanged()
        );
    }

    get mapZoom$(): Observable<number> {
        return this.store.state$.pipe(
            map(state => state.mapZoom),
            distinctUntilChanged(),
        );
    }

    get position$(): Observable<google.maps.LatLngLiteral> {
        return this.store.state$.pipe(
            map(state => state.position),
            distinctUntilChanged(),
            tap((position) => {
                if (position) {
                    this.setMapCenter(position);
                }
            })
        );
    }

    create(station: Station) {
        this.store.patch({
        }, 'station create');
        return this.firestore.create(station).then(_ => {
            this.store.patch({
            }, 'station create SUCCESS');
        }).catch(err => {
            this.store.patch({
            }, 'station create ERROR');
        });
    }

    delete(id: string): any {
        this.store.patch({
        }, 'station delete');
        return this.firestore.delete(id).catch(err => {
            this.store.patch({
            }, 'station delete ERROR');
        });
    }

    setMapCenter(center: google.maps.LatLngLiteral) {
        this.store.patch({ mapCenter: center }, 'map center set');
    }

    setMapZoom(zoom: number) {
        this.store.patch({ mapZoom: zoom }, 'map zoom set');
    }

    setPosition(position: google.maps.LatLngLiteral) {
        this.store.patch({ position: position }, 'position set');
    }

}