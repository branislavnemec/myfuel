import { StationEditDialog } from '../../states/station-edit-dialog';
import { StoreService } from './store.service';
import { Injectable } from '@angular/core';

@Injectable()
export class StationEditDialogStore extends StoreService<StationEditDialog> {

    protected store = 'station-edit-dialog';

    constructor() {
        super({
        });
    }
}
