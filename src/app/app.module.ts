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

import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { StationsPageComponent } from './components/stations-page/stations-page.component';
import { StationsListComponent } from './components/stations-list/stations-list.component';
import { StationsFormComponent } from './components/stations-form/stations-form.component';

import { StationsService } from './services/stations.service';
import { StationFirestore } from './services/station.firestore';
import { StationsPageStore } from './services/stations-page.store';
import { MapService } from './services/map.service';
import { MapPageStore } from './services/map-page.store';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StationsPageComponent,
    StationsListComponent,
    StationsFormComponent
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
    ReactiveFormsModule,
  ],
  providers: [
    StationsService,
    StationFirestore,
    StationsPageStore,
    MapService,
    MapPageStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
