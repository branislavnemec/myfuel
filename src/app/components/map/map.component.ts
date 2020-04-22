import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';
import { MapService } from 'src/app/services/map.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { MapFilter } from 'src/app/models/map-filter';
import { GeoUtils } from 'src/app/utils/geo-utils';
import { first, map } from 'rxjs/operators';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) mapInfoWindow: MapInfoWindow;

    geo: geofirex.GeoFireClient = geofirex.init(firebase);

    options: google.maps.MapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        streetViewControl: false,
        scaleControl: true,
        maxZoom: 17,
        minZoom: 8,
    }

    stations$: Observable<Station[]>;
    mapFilter$: Observable<MapFilter>;
    mapCenter$: Observable<google.maps.LatLngLiteral>;
    mapZoom$: Observable<number>;

    infoContent = '';
    infoContentId = '';

    constructor(private mapService: MapService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.mapFilter$ = this.mapService.mapFilter$;
        this.stations$ = this.mapService.stations$;
        this.mapCenter$ = this.mapService.mapCenter$;
        this.mapZoom$ = this.mapService.mapZoom$;
        this.mapService.mapCenter$.pipe(
            first()
        ).subscribe((center) => {
            if (!center) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.mapService.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.mapService.setMapCenter(this.googleMap.getCenter().toJSON());
        this.mapService.setMapZoom(this.googleMap.getZoom());
    }

    mapRightclick(event: google.maps.MouseEvent) {
        this.addStation(event.latLng.toJSON().lat, event.latLng.toJSON().lng);
    }

    addStation(lat: number, lng: number) {
        const position = this.geo.point(lat, lng);
        const newStation: Station = {
            name: 'new',
            lat: lat,
            lng: lng,
            position: position
        };
        this.mapService.create(newStation);
    }

    openInfo(marker: MapMarker, station: Station) {
        this.infoContentId = station.id;
        this.infoContent = station.name;
        this.mapInfoWindow.open(marker);
    }

    deleteStation() {
        this.mapService.delete(this.infoContentId);
    }

    editStation() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            id: this.infoContentId
        };

        this.dialog.open(StationEditDialogComponent, dialogConfig);
    }

    centerMap() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.mapService.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }

}
