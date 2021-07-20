import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StationService } from 'src/app/services/station.service';
import { filter, switchMap, map, tap, first } from 'rxjs/operators';
import { Station } from 'src/app/models/station';
import { Observable, Subscription } from 'rxjs';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';
import { FormArrayValidator, ObjectValidator } from 'src/app/utils/validators';
import { GeoFireXService } from 'src/app/utils/geofirex.service';
import { Keywords } from 'src/app/utils/keywords';
import { FuelType } from 'src/app/models/fuel-type';
import { FuelTypesService } from 'src/app/services/fuel-types.service';
import { JsonUtils } from 'src/app/utils/json-utils';
import { FuelPrice } from 'src/app/models/fuel-price';
import { BackButtonService } from 'src/app/utils/back-button.service';

@Component({
    selector: 'app-station-edit-dialog',
    templateUrl: './station-edit-dialog.component.html',
    styleUrls: ['./station-edit-dialog.component.scss']
})
export class StationEditDialogComponent implements OnInit, OnDestroy {

    inputForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lng: new FormControl('', Validators.required),
        country: new FormControl('', [Validators.required, ObjectValidator.mustBeObject]),
        city: new FormControl(''),
        street: new FormControl(''),
        zip: new FormControl(''),
        fuelTypesArray: new FormArray([], FormArrayValidator.atLeastOneIsTrue)
    });

    stationId: string;
    fuelTypes: FuelType[];
    fuelPrices: Map<string, FuelPrice>;

    station$: Observable<Station>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;
    filteredCountries$: Observable<Country[]>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;


    stationSubscription1 = Subscription.EMPTY;
    stationSubscription2 = Subscription.EMPTY;
    loadStationSubscription = Subscription.EMPTY;

    constructor(
        private stationService: StationService,
        private countriesService: CountriesService,
        private fuelTypesService: FuelTypesService,
        private backButtonService: BackButtonService,
        private geoFireXService: GeoFireXService,
        private dialogRef: MatDialogRef<StationEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        dialogRef.afterClosed()
            .pipe(
                first(),
                tap(() => this.backButtonService.resetDefaultHandler())
            ).subscribe();
        this.backButtonService.setCustomHandler(() => {
            dialogRef.close();
        });

        this.stationId = data.id;
        this.loadStationSubscription = this.stationService.loadStation(this.stationId).pipe(
        ).subscribe();
    }

    ngOnInit() {
        this.station$ = this.stationService.station$;
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

        this.stationSubscription1 = this.station$.pipe(
            filter((station: Station) => !!station),
            tap((station: Station) => {
                this.inputForm.controls.name.setValue(station.name);
                this.inputForm.controls.lat.setValue(station.lat);
                this.inputForm.controls.lng.setValue(station.lng);
                this.inputForm.controls.country.setValue('');
                this.inputForm.controls.city.setValue(station.address.city);
                this.inputForm.controls.street.setValue(station.address.street);
                this.inputForm.controls.zip.setValue(station.address.zip);
            }),
            switchMap((station: Station) => {
                return this.countries$.pipe(
                    tap((countries: Country[]) => {
                        if (countries.filter(country => country.id === station.address.country).length === 1) {
                            this.inputForm.controls.country.setValue(
                                countries.filter(country => country.id === station.address.country)[0]
                            );
                        }
                    })
                );
            })
        ).subscribe();

        this.stationSubscription2 = this.station$.pipe(
            filter((station: Station) => !!station),
            switchMap((station: Station) => {
                return this.fuelTypes$.pipe(
                    tap((fTypes: FuelType[]) => {
                        this.fuelTypes = [];
                        this.fuelPrices = JsonUtils.objectToMap(station.prices);
                        console.log(this.fuelPrices);
                        if ((this.inputForm.controls.fuelTypesArray as FormArray).length) {
                            (this.inputForm.controls.fuelTypesArray as FormArray).clear();
                        }
                        fTypes.forEach((fuelType: FuelType) => {
                            this.fuelTypes.push(fuelType);
                            const control = new FormControl(station.fuels.includes(fuelType.id));
                            (this.inputForm.controls.fuelTypesArray as FormArray).push(control);
                        });
                    })
                );
            })
        ).subscribe();

        this.filteredCountries$ = this.inputForm.controls.country.valueChanges.pipe(
            filter((value: string) => typeof value === 'string'),
            switchMap((value: string) => {
                return this.countries$.pipe(
                    map((countries: Country[]) => {
                        return this.filteredCountries(value, countries);
                    })
                );
            })
        );

    }

    ngOnDestroy(): void {
        this.stationSubscription1.unsubscribe();
        this.stationSubscription2.unsubscribe();
        this.loadStationSubscription.unsubscribe();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.inputForm.disable();
        const pos = this.geoFireXService.geoFireClient.point(
            Number(this.inputForm.controls.lat.value), Number(this.inputForm.controls.lng.value)
        );
        const updatedStation: Station = {
            id: this.stationId,
            name: this.inputForm.controls.name.value.toString(),
            lat: Number(this.inputForm.controls.lat.value),
            lng: Number(this.inputForm.controls.lng.value),
            position: pos,
            address: {
                country: this.inputForm.controls.country.value.id,
                city: this.inputForm.controls.city.value.toString(),
                street: this.inputForm.controls.street.value.toString(),
                zip: this.inputForm.controls.zip.value.toString()
            },
            keywords: Keywords.generateKeywords([this.inputForm.controls.name.value.toString(),
                this.inputForm.controls.city.value.toString()])
        };
        const fuels = [];
        const prices = {};
        (this.inputForm.controls.fuelTypesArray as FormArray).controls.forEach((control, index) => {
            console.log(index + ' ' + control.value + ' ' + this.fuelTypes[index].id);
            if (control.value) {
                fuels.push(this.fuelTypes[index].id);
                prices[this.fuelTypes[index].id] =
                this.fuelPrices.get(this.fuelTypes[index].id) ?
                    this.fuelPrices.get(this.fuelTypes[index].id) : { price: 0, date: new Date().toUTCString() };
            }
        });
        updatedStation.fuels = fuels;
        updatedStation.prices = prices;
        this.stationService.update(updatedStation).then(
            (result) => {
                console.log('update OK...');
                this.dialogRef.close();
            }
        ).catch(
            (error) => {
                console.log(error);
                this.inputForm.enable();
            }
        );
    }

    displayFn(country: Country): string {
        return country && country.name ? country.name : '';
    }

    optionSelected(event) {
        console.log(event.option.value);
    }

    private filteredCountries(value: string, countries: Country[]): Country[] {
        return countries.filter(country => country.name.toLowerCase().includes(value.toLowerCase()));
    }

}
