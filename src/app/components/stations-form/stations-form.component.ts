import { StationsService } from './../../services/stations.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';

@Component({
    selector: 'app-stations-form',
    templateUrl: './stations-form.component.html',
    styleUrls: ['./stations-form.component.scss']
})
export class StationsFormComponent implements OnInit {

    inputForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lng: new FormControl('', Validators.required)
    });

    status$: Observable<string>;

    constructor(
        private stationsService: StationsService
    ) {}

    ngOnInit() {
        this.status$ = this.stationsService.formStatus$;
    }

    isInvalid(name) {
        return this.inputForm.controls[name].invalid
           && (this.inputForm.controls[name].dirty || this.inputForm.controls[name].touched);
    }

    async submit() {
        this.inputForm.disable();
        const newStation: Station = {
            name: this.inputForm.controls.name.value,
            lat: Number(this.inputForm.controls.lat.value),
            lng: Number(this.inputForm.controls.lng.value),
            position: null
        }
        await this.stationsService.create(newStation);
        this.inputForm.reset();
        this.inputForm.enable();
    }

}