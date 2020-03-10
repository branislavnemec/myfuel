import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './components/map/map.component';
import { StationsPageComponent } from './components/stations-page/stations-page.component';

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'stations', component: StationsPageComponent },
  { path: '**',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  { path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
