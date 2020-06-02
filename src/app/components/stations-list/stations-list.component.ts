import { Station } from '../../models/station';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StationsService } from '../../services/stations.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';
import { FormControl } from '@angular/forms';
import { tap, first, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StationsFilterDialogComponent } from '../stations-filter-dialog/stations-filter-dialog.component';
import { StationsFilter } from 'src/app/models/stations-filter';

@Component({
    selector: 'app-stations-list',
    templateUrl: './stations-list.component.html',
    styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit {

    loading$: Observable<boolean>;
    stations$: Observable<Station[]>;
    noResults$: Observable<boolean>;
    searchInputValue$: Observable<string>;
    stationsFilter$: Observable<StationsFilter>;

    displayedColumns: string[] = ['name', 'action'];
    searchInputControl: FormControl = new FormControl();

    searchInputValueSubscription = Subscription.EMPTY;
    searchInputControlSubscription = Subscription.EMPTY;

    constructor(
        private stationsService: StationsService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loading$ = this.stationsService.loading$;
        this.noResults$ = this.stationsService.noResults$;
        this.stations$ = this.stationsService.stations$;
        this.searchInputValue$ = this.stationsService.searchInputValue$;
        this.stationsFilter$ = this.stationsService.stationsFilter$;

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

    deleteStation(station: Station) {
        this.stationsService.delete(station.id);
    }

    goToMap(station: Station) {
        this.router.navigate(['map'], { queryParams: { lat: station.lat, lng: station.lng } });
    }

    openStationsFilter() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        this.dialog.open(StationsFilterDialogComponent, dialogConfig);
    }

}