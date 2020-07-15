import { Component, OnInit, HostListener, NgZone, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonService } from './utils/back-button.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private backButtonService: BackButtonService
    ) {}

    @HostListener('document:backbutton')
    onBackButton() {
        this.ngZone.run(() => {
            console.log('Back button pressed');
            this.backButtonService.onBackButton();
        });
    }

    ngOnInit() {
    }

    goToMap() {
        this.router.navigate(['map']);
    }

    goToStations() {
        this.router.navigate(['stations']);
    }

}
