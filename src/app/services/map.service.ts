import { StationFirestore } from './firestore/station.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { MapPageStore } from './store/map-page.store';
import { MapFilter } from '../models/map-filter';
import { switchMap } from 'rxjs/operators';
import { GeoFireXService } from '../utils/geofirex.service';

@Injectable()
export class MapService {

    constructor(
        private firestore: StationFirestore,
        private store: MapPageStore,
        private geoFireXService: GeoFireXService
    ) {
        this.position$.pipe(
            filter((position: google.maps.LatLngLiteral) => !!position),
            switchMap((position: google.maps.LatLngLiteral) => {
                return this.mapFilter$.pipe(
                    switchMap((mapFilter: MapFilter) => {
                        return this.firestore.geoCollection$(this.geoFireXService.geoFireClient.point(position.lat, position.lng), mapFilter.range, 'position').pipe(
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
            distinctUntilChanged()
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

    setMapFilter(mapFilter: MapFilter) {
        this.store.patch({ mapFilter: mapFilter }, 'map filter set');
    }

}