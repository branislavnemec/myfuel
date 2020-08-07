import { StationsService } from './../../services/stations.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Station } from 'src/app/models/station';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ObjectValidator } from 'src/app/utils/validators';
import { GeoFireXService } from 'src/app/utils/geofirex.service';
import { Keywords } from 'src/app/utils/keywords';
import { FuelTypesService } from 'src/app/services/fuel-types.service';
import { FuelType } from 'src/app/models/fuel-type';

@Component({
    selector: 'app-stations-form',
    templateUrl: './stations-form.component.html',
    styleUrls: ['./stations-form.component.scss']
})
export class StationsFormComponent implements OnInit, OnDestroy {

    inputForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lng: new FormControl('', Validators.required),
        country: new FormControl('', [Validators.required, ObjectValidator.mustBeObject]),
        city: new FormControl(''),
        street: new FormControl(''),
        zip: new FormControl(''),
        fuelTypesArray: new FormArray([])
    });

    fuelTypes: FuelType[];

    formStatus$: Observable<string>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;
    filteredCountries$: Observable<Country[]>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;

    fuelTypesSubscription = Subscription.EMPTY;

    constructor(
        private stationsService: StationsService,
        private countriesService: CountriesService,
        private fuelTypesService: FuelTypesService,
        private geoFireXService: GeoFireXService
    ) {}

    ngOnInit() {
        this.formStatus$ = this.stationsService.formStatus$;
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

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

        this.fuelTypesSubscription = this.fuelTypes$.pipe(
            tap((fTypes: FuelType[]) => {
                this.fuelTypes = [];
                if ((this.inputForm.controls.fuelTypesArray as FormArray).length) {
                    (this.inputForm.controls.fuelTypesArray as FormArray).clear();
                }
                fTypes.forEach((fuelType: FuelType) => {
                    this.fuelTypes.push(fuelType);
                    const control = new FormControl(false);
                    (this.inputForm.controls.fuelTypesArray as FormArray).push(control);
                });
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.fuelTypesSubscription.unsubscribe();
    }

    isInvalid(name) {
        return this.inputForm.controls[name].invalid
           && (this.inputForm.controls[name].dirty || this.inputForm.controls[name].touched);
    }

    displayFn(country: Country): string {
        return country && country.name ? country.name : '';
    }

    optionSelected(event) {
        console.log(event.option.value);
    }

    async submit() {
        this.inputForm.disable();
        const pos = this.geoFireXService.geoFireClient.point(
            Number(this.inputForm.controls.lat.value), Number(this.inputForm.controls.lng.value)
        );
        const newStation: Station = {
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
                prices[this.fuelTypes[index].id] = 0;
            }
        });
        newStation.fuels = fuels;
        newStation.prices = prices;
        await this.stationsService.create(newStation);
        this.inputForm.reset();
        this.inputForm.enable();
    }

    private filteredCountries(value: string, countries: Country[]): Country[] {
        return countries.filter(country => country.name.toLowerCase().includes(value.toLowerCase()));
    }

}