import { Station } from '../../models/station';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StationsService } from '../../services/stations.service';

@Component({
    selector: 'app-stations-list',
    templateUrl: './stations-list.component.html',
    styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit {

    loading$: Observable<boolean>;
    stations$: Observable<Station[]>;
    noResults$: Observable<boolean>;

    constructor(
        private stationsService: StationsService
    ) {}

    ngOnInit() {
        this.loading$ = this.stationsService.loading$;
        this.noResults$ = this.stationsService.noResults$;
        this.stations$ = this.stationsService.stations$;
    }

    delete(station: Station) {
        this.stationsService.delete(station.id);
    }

}