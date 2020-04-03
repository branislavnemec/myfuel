import { Station } from '../models/station';

export interface StationEditDialog {

    loading: boolean;
    station: Station;
    formStatus: string;

}
