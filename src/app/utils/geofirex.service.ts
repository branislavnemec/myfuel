import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';

export class GeoFireXService {

    geoFireClient: geofirex.GeoFireClient = geofirex.init(firebase);

    constructor() {
    }

}