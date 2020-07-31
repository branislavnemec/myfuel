import { Station } from '../../models/station';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StationsService } from '../../services/stations.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';
import { FormControl } from '@angular/forms';
import { tap, first, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StationsFilterDialogComponent } from '../stations-filter-dialog/stations-filter-dialog.component';
import { StationsFilter } from 'src/app/models/stations-filter';
import { FuelTypesService } from 'src/app/services/fuel-types.service';
import { FuelType } from 'src/app/models/fuel-type';
import { StationPricesDialogComponent } from '../station-prices-dialog/station-prices-dialog.component';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

@Component({
    selector: 'app-stations-list',
    templateUrl: './stations-list.component.html',
    styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit, OnDestroy {

    loading$: Observable<boolean>;
    stations$: Observable<Station[]>;
    noResults$: Observable<boolean>;
    searchInputValue$: Observable<string>;
    stationsFilter$: Observable<StationsFilter>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;

    displayedColumns: string[] = ['name', 'price', 'action'];
    searchInputControl: FormControl = new FormControl();

    searchInputValueSubscription = Subscription.EMPTY;
    searchInputControlSubscription = Subscription.EMPTY;

    constructor(
        private stationsService: StationsService,
        private fuelTypesService: FuelTypesService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loading$ = this.stationsService.loading$;
        this.noResults$ = this.stationsService.noResults$;
        this.stations$ = this.stationsService.stations$;
        this.searchInputValue$ = this.stationsService.searchInputValue$;
        this.stationsFilter$ = this.stationsService.stationsFilter$;
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

        this.searchInputValueSubscription = this.searchInputValue$.pipe(
            first(),
            tap((searchInput: string) => {
                this.searchInputControl.setValue(searchInput);
            })
        ).subscribe();

        this.searchInputControlSubscription = this.searchInputControl.valueChanges.pipe(
            debounceTime(800),
            tap((value: string) => {
                this.stationsService.setSearchInputValue(value);
            })
        ).subscribe();

    }

    ngOnDestroy() {
        this.searchInputValueSubscription.unsubscribe();
        this.searchInputControlSubscription.unsubscribe();
    }

    editStation(station: Station) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: station.id
        };
        this.dialog.open(StationEditDialogComponent, dialogConfig);
    }

    editPrices(station: Station) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: station.id
        };
        this.dialog.open(StationPricesDialogComponent, dialogConfig);
    }

    deleteStation(station: Station) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            text: 'Really delete station?'
        };
        const dialogRef = this.dialog.open(YesNoDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(
            first(),
            tap((result) => {
                if (result === 'yes') {
                    this.stationsService.delete(station.id);
                }
            })
        ).subscribe();
    }

    goToMap(station: Station) {
        this.router.navigate(['map'], { queryParams: { lat: station.lat, lng: station.lng } });
    }

    openStationsFilter() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        this.dialog.open(StationsFilterDialogComponent, dialogConfig);
    }

    findFuelName(fuelId: string, fuelTypes: FuelType[]) {
        return fuelTypes.find((ft) => ft.id === fuelId) ? fuelTypes.find((ft) => ft.id === fuelId).name : '';
    }

    toTimestamp(isodate: string) {
        const date = new Date(isodate);
        return date.getTime();
    }
}
