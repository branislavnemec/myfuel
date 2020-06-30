import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { FuelType } from '../../models/fuel-type';

@Injectable()
export class FuelTypeFirestore extends FirestoreService<FuelType> {

    protected basePath = 'fuels';

}