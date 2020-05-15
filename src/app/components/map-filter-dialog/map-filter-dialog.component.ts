import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { StationService } from 'src/app/services/station.service';
import { first, filter, switchMap, map, tap } from 'rxjs/operators';
import { Station } from 'src/app/models/station';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';
import { ObjectValidator } from 'src/app/utils/validators';
import { MapService } from 'src/app/services/map.service';
import { MapFilter } from 'src/app/models/map-filter';

@Component({
    selector: 'app-map-filter-dialog',
    templateUrl: './map-filter-dialog.component.html',
    styleUrls: ['./map-filter-dialog.component.scss']
})
export class MapFilterDialogComponent implements OnInit, OnDestroy {

    range: number;
    mapFilter$: Observable<MapFilter>;

    constructor(
        private mapService: MapService,
        private dialogRef: MatDialogRef<MapFilterDialogComponent>) {
    }

    ngOnInit() {
        this.mapFilter$ = this.mapService.mapFilter$.pipe(
            tap((mapFilter: MapFilter) => {
                this.range = mapFilter.range;
            })
        );
    }

    ngOnDestroy(): void {
    }

    rangeChange(event) {
        this.range = event.value;
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        const newMapFilter: MapFilter = {
            range: this.range
        }
        this.mapService.setMapFilter(newMapFilter);
        this.dialogRef.close();
    }

}
