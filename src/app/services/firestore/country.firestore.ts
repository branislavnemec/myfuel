import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Country } from '../../models/country';

@Injectable()
export class CountryFirestore extends FirestoreService<Country> {

    protected basePath = 'countries';

}
