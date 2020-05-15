import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StationService } from 'src/app/services/station.service';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { Station } from 'src/app/models/station';
import { Observable, Subscription } from 'rxjs';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';
import { ObjectValidator } from 'src/app/utils/validators';
import { GeoFireXService } from 'src/app/utils/geofirex.service';

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
    });

    stationId: string;
    
    station$: Observable<Station>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;
    filteredCountries$: Observable<Country[]>;

    stationSubscription = Subscription.EMPTY;
    loadStationSubscription = Subscription.EMPTY;

    constructor(
        private stationService: StationService,
        private countriesService: CountriesService,
        private geoFireXService: GeoFireXService,
        private dialogRef: MatDialogRef<StationEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.stationId = data.id;

        this.loadStationSubscription = this.stationService.loadStation(this.stationId).pipe(
        ).subscribe();
    }

    ngOnInit() {
        this.station$ = this.stationService.station$;
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;

        this.stationSubscription = this.station$.pipe(
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
                            this.inputForm.controls.country.setValue(countries.filter(country => country.id === station.address.country)[0]);
                        }
                    })
                )
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
        this.stationSubscription.unsubscribe();
        this.loadStationSubscription.unsubscribe();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.inputForm.disable();
        const position = this.geoFireXService.geoFireClient.point(Number(this.inputForm.controls.lat.value), Number(this.inputForm.controls.lng.value));
        const updatedStation: Station = {
            id: this.stationId,
            name: this.inputForm.controls.name.value.toString(),
            lat: Number(this.inputForm.controls.lat.value),
            lng: Number(this.inputForm.controls.lng.value),
            position: position,
            address: {
                country: this.inputForm.controls.country.value.id,
                city: this.inputForm.controls.city.value,
                street: this.inputForm.controls.street.value,
                zip: this.inputForm.controls.zip.value
            }
        }
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
