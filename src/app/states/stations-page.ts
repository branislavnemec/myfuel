import { Station } from '../models/station';

export interface StationsPage {

    loading: boolean;
    stations: Station[];
    formStatus: string;

}
