import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { ReactiveFormsModule } from '@angular/forms'

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { StationsPageComponent } from './components/stations-page/stations-page.component';
import { StationsListComponent } from './components/stations-list/stations-list.component';
import { StationsFormComponent } from './components/stations-form/stations-form.component';
import { StationsFilterDialogComponent } from './components/stations-filter-dialog/stations-filter-dialog.component';
import { StationEditDialogComponent } from './components/station-edit-dialog/station-edit-dialog.component';
import { MapFilterDialogComponent } from './components/map-filter-dialog/map-filter-dialog.component';
import { StationPricesDialogComponent } from './components/station-prices-dialog/station-prices-dialog.component';

import { StationsService } from './services/stations.service';
import { StationFirestore } from './services/firestore/station.firestore';
import { StationsPageStore } from './services/store/stations-page.store';
import { MapService } from './services/map.service';
import { MapPageStore } from './services/store/map-page.store';
import { StationService } from './services/station.service';
import { StationEditDialogStore } from './services/store/station-edit-dialog.store';
import { CountriesService } from './services/countries.service';
import { CountryFirestore } from './services/firestore/country.firestore';
import { LovCountriesStore } from './services/store/lov-countries.store';
import { GeoFireXService } from './utils/geofirex.service';
import { LovFuelTypesStore } from './services/store/lov-fuel-types.store';
import { FuelTypesService } from './services/fuel-types.service';
import { FuelTypeFirestore } from './services/firestore/fuel-type.firestore';
import { BackButtonService } from './utils/back-button.service';


@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        StationsPageComponent,
        StationsListComponent,
        StationsFormComponent,
        StationEditDialogComponent,
        StationPricesDialogComponent,
        StationsFilterDialogComponent,
        MapFilterDialogComponent
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        GoogleMapsModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatListModule,
        MatExpansionModule,
        MatTableModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSliderModule,
        MatSelectModule,
        MatChipsModule,
        MatSlideToggleModule
    ],
    providers: [
        StationsService,
        StationFirestore,
        StationsPageStore,
        MapService,
        MapPageStore,
        StationService,
        StationEditDialogStore,
        CountriesService,
        CountryFirestore,
        LovCountriesStore,
        LovFuelTypesStore,
        FuelTypesService,
        FuelTypeFirestore,
        GeoFireXService,
        BackButtonService
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        StationEditDialogComponent,
        StationPricesDialogComponent,
        StationsFilterDialogComponent,
        MapFilterDialogComponent
    ]
})
export class AppModule { }
