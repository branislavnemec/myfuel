import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap, MapCircle } from '@angular/google-maps'
import { Observable, Subscription } from 'rxjs';
import { Station } from 'src/app/models/station';
import { MapService } from 'src/app/services/map.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';
import { MapFilter } from 'src/app/models/map-filter';
import { first, tap } from 'rxjs/operators';
import { MapFilterDialogComponent } from '../map-filter-dialog/map-filter-dialog.component';
import { GeoFireXService } from 'src/app/utils/geofirex.service';
import { Keywords } from 'src/app/utils/keywords';
import { ActivatedRoute } from '@angular/router';
import { StationPricesDialogComponent } from '../station-prices-dialog/station-prices-dialog.component';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

    @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) mapInfoWindow: MapInfoWindow;
    @ViewChild(MapCircle, { static: false }) mapCircle: MapCircle;

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
    };

    stations$: Observable<Station[]>;
    mapFilter$: Observable<MapFilter>;
    mapCenter$: Observable<google.maps.LatLngLiteral>;
    position$: Observable<google.maps.LatLngLiteral>;
    circleDraggable$: Observable<boolean>;

    zoom = 0;
    selectedStation: Station;

    mapZoomSubscription = Subscription.EMPTY;

    constructor(private mapService: MapService,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private geoFireXService: GeoFireXService) {
    }

    ngOnInit(): void {
        this.mapFilter$ = this.mapService.mapFilter$;
        this.stations$ = this.mapService.stations$;
        this.mapCenter$ = this.mapService.mapCenter$;
        this.position$ = this.mapService.position$;
        this.circleDraggable$ = this.mapService.circleDraggable$;
        this.mapZoomSubscription = this.mapService.mapZoom$.subscribe(value => {
            console.log(value);
            this.zoom = this.zoom + (value - this.zoom);
        });
        this.mapService.mapCenter$.pipe(
            first()
        ).subscribe((center) => {
            if (!!this.route.snapshot.queryParams.lat && !!this.route.snapshot.queryParams.lng) {
                this.mapService.setPosition({ lat: Number(this.route.snapshot.queryParams.lat),
                                              lng: Number(this.route.snapshot.queryParams.lng) });
                this.mapService.setMapCenter({ lat: Number(this.route.snapshot.queryParams.lat),
                                               lng: Number(this.route.snapshot.queryParams.lng) });
                this.mapService.setMapZoom(14);
            } else if (!center) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.mapService.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                    this.mapService.setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.mapService.setMapCenter(this.googleMap.getCenter().toJSON());
        this.mapZoomSubscription.unsubscribe();
    }

    mapDblclick(event: google.maps.MouseEvent) {
        this.mapService.setPosition({ lat: event.latLng.toJSON().lat, lng: event.latLng.toJSON().lng });
    }

    circleDblclick(event: google.maps.MouseEvent) {
        let country = '';
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                country = results.find((result) => result.types.includes('country')).address_components[0].short_name;
            }
            this.addStation(event.latLng.toJSON().lat, event.latLng.toJSON().lng, country);
        });
    }

    circleDragend(event: google.maps.MouseEvent) {
        this.mapService.setPosition({ lat: this.mapCircle.getCenter().toJSON().lat, lng: this.mapCircle.getCenter().toJSON().lng });
    }

    zoomChanged() {
        setTimeout(() => {
            console.log('zoomChanged');
            this.mapService.setMapZoom(this.googleMap.getZoom());
        })
    }

    addStation(lat: number, lng: number, country: string) {
        const position = this.geoFireXService.geoFireClient.point(lat, lng);
        const newStation: Station = {
            name: 'new',
            name_lowercase: 'new',
            lat: lat,
            lng: lng,
            position: position,
            address: {
                country: country,
                city: '',
                street: '',
                zip: ''
            },
            keywords: Keywords.generateKeywords(['new', '']),
            fuels: [],
            prices: {}
        };
        this.mapService.create(newStation);
    }

    openInfo(marker: MapMarker, station: Station) {
        this.selectedStation = station;
        this.mapInfoWindow.open(marker);
    }

    deleteStation() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            text: 'Delete station?'
        };
        const dialogRef = this.dialog.open(YesNoDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(
            first(),
            tap((result) => {
                if (result === 'yes') {
                    this.mapService.delete(this.selectedStation.id);
                }
            })
        ).subscribe();
    }

    editStation() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: this.selectedStation.id
        };
        this.dialog.open(StationEditDialogComponent, dialogConfig);
    }

    editPrices() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: this.selectedStation.id
        };
        this.dialog.open(StationPricesDialogComponent, dialogConfig);
    }

    centerMap() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.mapService.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
            this.mapService.setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            this.mapService.setMapZoom(14);
        });
    }

    setPositionFromMapCenter() {
        this.mapService.setPosition(this.googleMap.getCenter().toJSON());
        this.mapService.setMapCenter(this.googleMap.getCenter().toJSON());
    }

    openMapFilter() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        this.dialog.open(MapFilterDialogComponent, dialogConfig);
    }

    toggleCircleDraggable() {
        this.mapService.toggleCircleDraggable(!this.mapCircle.getDraggable());
    }

}
