import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StationService } from 'src/app/services/station.service';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { Station } from 'src/app/models/station';
import { Observable, Subscription } from 'rxjs';
import { GeoFireXService } from 'src/app/utils/geofirex.service';
import { FuelType } from 'src/app/models/fuel-type';
import { FuelTypesService } from 'src/app/services/fuel-types.service';
import { JsonUtils } from 'src/app/utils/json-utils';
import { FuelPrice } from 'src/app/models/fuel-price';

@Component({
    selector: 'app-station-prices-dialog',
    templateUrl: './station-prices-dialog.component.html',
    styleUrls: ['./station-prices-dialog.component.scss']
})
export class StationPricesDialogComponent implements OnInit, OnDestroy {

    _Object = Object;

    inputForm: FormGroup = new FormGroup({
    });

    stationId: string;
    station: Station;
    fuelPrices: Map<string, FuelPrice>;

    station$: Observable<Station>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;


    stationSubscription = Subscription.EMPTY;
    loadStationSubscription = Subscription.EMPTY;

    constructor(
        private stationService: StationService,
        private fuelTypesService: FuelTypesService,
        private dialogRef: MatDialogRef<StationPricesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.stationId = data.id;

        this.loadStationSubscription = this.stationService.loadStation(this.stationId).pipe(
        ).subscribe();
    }

    ngOnInit() {
        this.station$ = this.stationService.station$;
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

        this.stationSubscription = this.station$.pipe(
            filter((station: Station) => !!station),
            tap((station: Station) => {
                this.station = station;
                if (this.inputForm.controls) {
                    Object.keys(this.inputForm.controls).forEach((controlName: string) => this.inputForm.removeControl(controlName));
                }
                this.fuelPrices = JsonUtils.objectToMap(station.prices);
                station.fuels.forEach((fuelId: string) => {
                    const control = new FormControl(this.fuelPrices.get(fuelId).price);
                    this.inputForm.addControl(fuelId, control);
                });
            })
        ).subscribe();

    }

    ngOnDestroy(): void {
        this.stationSubscription.unsubscribe();
        this.loadStationSubscription.unsubscribe();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.inputForm.disable();
        const prices = {};
        Object.keys(this.inputForm.controls).forEach((controlName: string) => {
            if (this.inputForm.get(controlName).value !== this.fuelPrices.get(controlName).price) {
                prices[controlName] = { price: Number(this.inputForm.get(controlName).value), date: new Date().toUTCString() }
            } else {
                prices[controlName] = this.fuelPrices.get(controlName)
            }
        });
        this.station.prices = prices;
        this.stationService.update(this.station).then(
            (result) => {
                console.log('update prices OK...');
                this.dialogRef.close();
            }
        ).catch(
            (error) => {
                console.log(error);
                this.inputForm.enable();
            }
        );
    }

    findFuelName(fuelId: string, fuelTypes: FuelType[]) {
        return fuelTypes.find((ft) => ft.id === fuelId) ? fuelTypes.find((ft) => ft.id === fuelId).name : '';
    }
}
