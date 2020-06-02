import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StationsService } from 'src/app/services/stations.service';
import { StationsFilter } from 'src/app/models/stations-filter';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
    selector: 'app-stations-filter-dialog',
    templateUrl: './stations-filter-dialog.component.html',
    styleUrls: ['./stations-filter-dialog.component.scss']
})
export class StationsFilterDialogComponent implements OnInit, OnDestroy {

    selectedCountryId: string;
    selectedCountryName: string;

    stationsFilter$: Observable<StationsFilter>;
    countriesLoading$: Observable<boolean>;
    countries$: Observable<Country[]>;
    countriesNoResults$: Observable<boolean>;

    constructor(
        private stationsService: StationsService,
        private countriesService: CountriesService,
        private dialogRef: MatDialogRef<StationsFilterDialogComponent>) {
    }

    ngOnInit() {
        this.countriesLoading$ = this.countriesService.loading$;
        this.countriesNoResults$ = this.countriesService.noResults$;
        this.countries$ = this.countriesService.countries$;

        this.stationsFilter$ = this.stationsService.stationsFilter$.pipe(
            tap((stationsFilter: StationsFilter) => {
                this.selectedCountryId = stationsFilter.country.id;
                this.selectedCountryName = stationsFilter.country.name;
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
            country: {
                id: this.selectedCountryId,
                name: this.selectedCountryName
            }
        }
        this.stationsService.setStationsFilter(newStationsFilter);
        this.dialogRef.close();
    }

    selectionChange(event) {
        this.selectedCountryId = event.value;
        this.selectedCountryName = event.source.selected.viewValue;
    }
}
