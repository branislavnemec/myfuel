import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { Injectable } from '@angular/core';

@Injectable()
export class GeoFireXService {

    geoFireClient: geofirex.GeoFireClient = geofirex.init(firebase);

    constructor() {
        console.log(this.geoFireClient);
    }

}
