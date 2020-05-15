import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
