import { StationFirestore } from './firestore/station.firestore';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { tap, map, distinctUntilChanged, filter, distinctUntilKeyChanged } from 'rxjs/operators';
import { MapPageStore } from './store/map-page.store';
import { MapFilter } from '../models/map-filter';
import { switchMap } from 'rxjs/operators';
import { GeoFireXService } from '../utils/geofirex.service';
import { IndexedDBService } from '../utils/indexed-db.service';
import { Activity } from '../utils/activities';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class MapService {

    constructor(
        private firestore: StationFirestore,
        private store: MapPageStore,
        private geoFireXService: GeoFireXService,
        private indexedDBService: IndexedDBService,
        private matSnackBar: MatSnackBar,
        private ngZone: NgZone
    ) {
        this.position$.pipe(
            filter((position: google.maps.LatLngLiteral) => !!position),
            switchMap((position: google.maps.LatLngLiteral) => {
                return this.mapFilter$.pipe(
                    distinctUntilKeyChanged('range'),
                    switchMap((mapFilter: MapFilter) => {
                        console.log('call geoQuery.........');
                        return this.firestore.geoCollection$(this.geoFireXService.geoFireClient.point(position.lat, position.lng), mapFilter.range, 'position').pipe(
                            tap((stations) => {
                                this.store.patch({
                                    stations,
                                }, 'map stations geoCollection subscription');
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

    get circleDraggable$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => state.circleDraggable),
            distinctUntilChanged()
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
                        }, 'station create');
                        return this.firestore.create(station).then(_ => {
                            this.store.patch({
                            }, 'station create SUCCESS');
                            this.indexedDBService.logActivity(Activity.CREATE_NEW_STATION, environment.activityLimits.createNewStation.maxAttempts);
                        }).catch(err => {
                            this.store.patch({
                            }, 'station create ERROR');
                        });
                    } else {
                        this.matSnackBar.open('Create new station limit exceeded', null, {
                            duration: 2000,
                        });
                    }
                });
            }
        );
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

    setPosition(pos: google.maps.LatLngLiteral) {
        this.store.patch({ position: pos }, 'position set');
    }

    setMapFilter(mapFil: MapFilter) {
        this.store.patch({ mapFilter: mapFil }, 'map filter set');
    }

    toggleCircleDraggable(draggable: boolean) {
        this.store.patch({ circleDraggable: draggable }, 'circle draggable togle');
    }

}
