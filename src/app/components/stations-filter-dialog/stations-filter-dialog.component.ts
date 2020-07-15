import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StationsService } from 'src/app/services/stations.service';
import { StationsFilter } from 'src/app/models/stations-filter';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';
import { FuelType } from 'src/app/models/fuel-type';
import { FuelTypesService } from 'src/app/services/fuel-types.service';
import { BackButtonService } from 'src/app/utils/back-button.service';

@Component({
    selector: 'app-stations-filter-dialog',
    templateUrl: './stations-filter-dialog.component.html',
    styleUrls: ['./stations-filter-dialog.component.scss']
})
export class StationsFilterDialogComponent implements OnInit, OnDestroy {

    selectedCountryId: string;
    selectedFuelTypeId: string;

    stationsFilter$: Observable<StationsFilter>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;

    constructor(
        private stationsService: StationsService,
        private countriesService: CountriesService,
        private fuelTypesService: FuelTypesService,
        private dialogRef: MatDialogRef<StationsFilterDialogComponent>,
        private backButtonService: BackButtonService
    ) {
        dialogRef.afterClosed()
            .pipe(
                first(),
                tap(() => this.backButtonService.resetDefaultHandler())
            ).subscribe();
        this.backButtonService.setCustomHandler(() => {
            dialogRef.close();
        });
    }

    ngOnInit() {
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

        this.stationsFilter$ = this.stationsService.stationsFilter$.pipe(
            tap((stationsFilter: StationsFilter) => {
                this.selectedCountryId = stationsFilter.countryId;
                this.selectedFuelTypeId = stationsFilter.fuelTypeId;
            })
        );
    }

    ngOnDestroy(): void {
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        const newStationsFilter: StationsFilter = {
            countryId: this.selectedCountryId,
            fuelTypeId: this.selectedFuelTypeId
        }
        this.stationsService.setStationsFilter(newStationsFilter);
        this.dialogRef.close();
    }

    countryChange(event) {
        this.selectedCountryId = event.value;
    }

    fuelTypeChange(event) {
        this.selectedFuelTypeId = event.value;
    }

}
