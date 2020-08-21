import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonService } from './utils/back-button.service';
import { MainLayoutService } from './services/main-layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    mainMenuItem$: Observable<string>;
    mainMenuVisible$: Observable<boolean>;
    title$: Observable<string>;

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private backButtonService: BackButtonService,
        private mainLayoutService: MainLayoutService
    ) {}

    @HostListener('document:backbutton')
    onBackButton() {
        this.ngZone.run(() => {
            console.log('Back button pressed');
            this.backButtonService.onBackButton();
        });
    }

    ngOnInit() {
        this.mainMenuItem$ = this.mainLayoutService.mainMenuItem$;
        this.mainMenuVisible$ = this.mainLayoutService.mainMenuVisible$;
        this.title$ = this.mainLayoutService.title$;
    }

    goToMap() {
        this.router.navigate(['map']);
    }

    goToStations() {
        this.router.navigate(['stations']);
    }

    goToFavourites() {
    }

}
