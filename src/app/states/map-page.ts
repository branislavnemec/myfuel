import { Station } from '../models/station';
import { MapFilter } from '../models/map-filter';

export interface MapPage {

    stations: Station[];
    mapFilter: MapFilter;
    mapCenter: google.maps.LatLngLiteral;
    mapZoom: number;
    position: google.maps.LatLngLiteral;
    circleDraggable: boolean;
}
