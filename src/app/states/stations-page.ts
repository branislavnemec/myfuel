import { Station } from '../models/station';
import { StationsFilter } from '../models/stations-filter';

export interface StationsPage {

    loading: boolean;
    stations: Station[];
    formStatus: string;
    searchInputValue: string;
    stationsFilter: StationsFilter;

}
