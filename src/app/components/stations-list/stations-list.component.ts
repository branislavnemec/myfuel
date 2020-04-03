import { Station } from '../../models/station';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StationsService } from '../../services/stations.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';

@Component({
    selector: 'app-stations-list',
    templateUrl: './stations-list.component.html',
    styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit {

    loading$: Observable<boolean>;
    stations$: Observable<Station[]>;
    noResults$: Observable<boolean>;
    displayedColumns: string[] = ['name', 'action'];

    constructor(
        private stationsService: StationsService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loading$ = this.stationsService.loading$;
        this.noResults$ = this.stationsService.noResults$;
        this.stations$ = this.stationsService.stations$;
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

}