import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { FuelTypeFirestore } from './firestore/fuel-type.firestore';
import { LovFuelTypesStore } from './store/lov-fuel-types.store';
import { FuelType } from '../models/fuel-type';

@Injectable()
export class FuelTypesService {

    constructor(
        private firestore: FuelTypeFirestore,
        private store: LovFuelTypesStore) {

        this.firestore.collection$().pipe(
            tap(fuelTypes => {
                this.store.patch({
                    loading: false,
                    fuelTypes,
                }, 'fuels collection subscription');
            })
        ).subscribe();

    }

    get fuelTypes$(): Observable<FuelType[]> {
        return this.store.state$.pipe(
            map(state => state.fuelTypes),
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
                    && state.fuelTypes
                    && state.fuelTypes.length === 0
            }),
            distinctUntilChanged()
        );
    }

}