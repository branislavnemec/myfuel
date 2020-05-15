import { StationsService } from './../../services/stations.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country';
import { filter, map, switchMap } from 'rxjs/operators';
import { ObjectValidator } from 'src/app/utils/validators';
import { GeoFireXService } from 'src/app/utils/geofirex.service';

@Component({
    selector: 'app-stations-form',
    templateUrl: './stations-form.component.html',
    styleUrls: ['./stations-form.component.scss']
})
export class StationsFormComponent implements OnInit {

    inputForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lng: new FormControl('', Validators.required),
        country: new FormControl('', [Validators.required, ObjectValidator.mustBeObject]),
        city: new FormControl(''),
        street: new FormControl(''),
        zip: new FormControl(''),
    });

    status$: Observable<string>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;
    filteredCountries$: Observable<Country[]>;

    constructor(
        private stationsService: StationsService,
        private countriesService: CountriesService,
        private geoFireXService: GeoFireXService
    ) {}

    ngOnInit() {
        this.status$ = this.stationsService.formStatus$;
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;
        
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
        const position = this.geoFireXService.geoFireClient.point(Number(this.inputForm.controls.lat.value), Number(this.inputForm.controls.lng.value));
        const newStation: Station = {
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
        await this.stationsService.create(newStation);
        this.inputForm.reset();
        this.inputForm.enable();
    }

    private filteredCountries(value: string, countries: Country[]): Country[] {
        return countries.filter(country => country.name.toLowerCase().includes(value.toLowerCase()));
    }

}