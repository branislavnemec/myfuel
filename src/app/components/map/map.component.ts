import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';
import { MapService } from 'src/app/services/map.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StationEditDialogComponent } from '../station-edit-dialog/station-edit-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) mapInfoWindow: MapInfoWindow

  zoom = 12;
  center: google.maps.LatLngLiteral = {lat: 48.14419022758065, lng: 17.107632924659644};
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 17,
    minZoom: 8,
  }
  stations$: Observable<Station[]>;

  infoContent = '';
  infoContentId = '';

  constructor(private mapService: MapService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });
    this.stations$ = this.mapService.stations$;
  }

  mapDblclick(event: google.maps.MouseEvent) {
    console.log(event.latLng.toJSON());
    this.addStation(event.latLng.toJSON().lat, event.latLng.toJSON().lng);
  }

  addStation(lat: number, lng: number) {
    const newStation: Station = { name: 'new station', lat: lat, lng: lng }
    this.mapService.create(newStation);
  }

  openInfo(marker: MapMarker, station: Station) {
    this.infoContentId = station.id;
    this.infoContent = station.lat.toString();
    this.mapInfoWindow.open(marker);
  }

  deleteStation() {
    console.log(this.infoContentId);
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


}
