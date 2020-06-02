import { StationEditDialog } from '../../states/station-edit-dialog';
import { StoreService } from './store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class StationEditDialogStore extends StoreService<StationEditDialog> {

    protected store: string = 'station-edit-dialog';

    constructor() {
        super({
        });
    }
}