import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { MainLayoutStore } from './store/main-layout.store';

@Injectable()
export class MainLayoutService {

    constructor(
        private router: Router,
        private store: MainLayoutStore) {

        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            tap((event: NavigationEnd) => {
                console.log(event);
                let menuItemValue = 'map';
                let titleValue = 'Map';
                if (event.url.startsWith('/map')) {
                    menuItemValue = 'map';
                    titleValue = 'Map';
                } else if (event.url.startsWith('/stations')) {
                    menuItemValue = 'stations';
                    titleValue = 'Stations';
                }
                this.store.patch({
                    mainMenuItem: menuItemValue,
                    title: titleValue
                }, 'router navigation subscription');
            })
        ).subscribe();

    }

    get mainMenuItem$(): Observable<string> {
        return this.store.state$.pipe(
            map(state => state.mainMenuItem),
            distinctUntilChanged()
        );
    }

    get mainMenuVisible$(): Observable<boolean> {
        return this.store.state$.pipe(
            map(state => state.mainMenuVisible),
            distinctUntilChanged()
        );
    }

    get title$(): Observable<string> {
        return this.store.state$.pipe(
            map(state => state.title),
            distinctUntilChanged()
        );
    }

}
