import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) googleMap: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) mapInfoWindow: MapInfoWindow

  zoom = 12;
  center: google.maps.LatLngLiteral;
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

  constructor(private mapService: MapService) {
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

  mapClick(event: google.maps.MouseEvent) {
    console.log(event.latLng.toJSON());
    this.addStation(event.latLng.toJSON().lat, event.latLng.toJSON().lng);
  }

  addStation(lat: number, lng: number) {
    const newStation: Station = { name: 'new station', lat: lat, lng: lng }
    this.mapService.create(newStation);
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.mapInfoWindow.open(marker)
  }

}
