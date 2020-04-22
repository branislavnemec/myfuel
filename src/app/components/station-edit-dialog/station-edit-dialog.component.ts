import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { StationService } from 'src/app/services/station.service';
import { first } from 'rxjs/operators';
import { Station } from 'src/app/models/station';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';

@Component({
    selector: 'app-station-edit-dialog',
    templateUrl: './station-edit-dialog.component.html',
    styleUrls: ['./station-edit-dialog.component.scss']
})
export class StationEditDialogComponent implements OnInit {

    geo: geofirex.GeoFireClient = geofirex.init(firebase);

    inputForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lng: new FormControl('', Validators.required)
    });
    stationId: string;
    station$: Observable<Station>;

    constructor(
        private stationService: StationService,
        private dialogRef: MatDialogRef<StationEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.stationId = data.id;
    }

    ngOnInit() {
        this.station$ = this.stationService.station$;
        this.station$.subscribe(
            (station: Station) => {
                if (station) {
                    this.inputForm.controls.name.setValue(station.name);
                    this.inputForm.controls.lat.setValue(station.lat);
                    this.inputForm.controls.lng.setValue(station.lng);
                }
            }
        );

        this.stationService.loadStation(this.stationId).pipe(
            first()
        ).subscribe();

    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.inputForm.disable();
        const position = this.geo.point(Number(this.inputForm.controls.lat.value), Number(this.inputForm.controls.lng.value));
        const updatedStation: Station = {
            id: this.stationId,
            name: this.inputForm.controls.name.value,
            lat: Number(this.inputForm.controls.lat.value),
            lng: Number(this.inputForm.controls.lng.value),
            position: position
        }
        this.stationService.update(updatedStation).then(
            (result) => {
                console.log('update OK...');
                this.dialogRef.close();
            }
        ).catch(
            (error) => {
                console.log(error);
                this.inputForm.enable();
            }
        );
    }

}
