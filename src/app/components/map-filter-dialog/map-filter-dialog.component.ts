import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { MapFilter } from 'src/app/models/map-filter';
import { FuelType } from 'src/app/models/fuel-type';
import { FuelTypesService } from 'src/app/services/fuel-types.service';

@Component({
    selector: 'app-map-filter-dialog',
    templateUrl: './map-filter-dialog.component.html',
    styleUrls: ['./map-filter-dialog.component.scss']
})
export class MapFilterDialogComponent implements OnInit, OnDestroy {

    selectedRange: number;
    selectedFuelTypeId: string;

    mapFilter$: Observable<MapFilter>;
    fuelTypesLoading$: Observable<boolean>;
    fuelTypes$: Observable<FuelType[]>;
    fuelTypesNoResults$: Observable<boolean>;

    constructor(
        private mapService: MapService,
        private fuelTypesService: FuelTypesService,
        private dialogRef: MatDialogRef<MapFilterDialogComponent>) {
    }

    ngOnInit() {
        this.fuelTypesLoading$ = this.fuelTypesService.loading$;
        this.fuelTypesNoResults$ = this.fuelTypesService.noResults$;
        this.fuelTypes$ = this.fuelTypesService.fuelTypes$;

        this.mapFilter$ = this.mapService.mapFilter$.pipe(
            tap((mapFilter: MapFilter) => {
                this.selectedRange = mapFilter.range;
                this.selectedFuelTypeId = mapFilter.fuelTypeId;
            })
        );
    }

    ngOnDestroy(): void {
    }

    rangeChange(event) {
        this.selectedRange = event.value;
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        const newMapFilter: MapFilter = {
            range: this.selectedRange,
            fuelTypeId: this.selectedFuelTypeId
        }
        this.mapService.setMapFilter(newMapFilter);
        this.dialogRef.close();
    }

    fuelTypeChange(event) {
        this.selectedFuelTypeId = event.value;
    }

}
