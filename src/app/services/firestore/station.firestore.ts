import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Station } from '../../models/station';

@Injectable()
export class StationFirestore extends FirestoreService<Station> {

    protected basePath: string = 'stations';

}