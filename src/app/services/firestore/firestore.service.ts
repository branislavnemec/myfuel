import { Injectable } from "@angular/core";
import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { tap, distinctUntilChanged } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { GeoFireXService } from '../../utils/geofirex.service';
import * as geofirex from 'geofirex';

@Injectable()
export abstract class FirestoreService<T> {

    protected abstract basePath: string;

    constructor(
        protected firestore: AngularFirestore,
        protected geoFireXService: GeoFireXService
    ) {}

    doc$(id: string): Observable<T> {
        return this.firestore.doc<T>(`${this.basePath}/${id}`).valueChanges().pipe(
            tap(r => {
                if (!environment.production) {
                    console.groupCollapsed(`Firestore Streaming [${this.basePath}] [doc$] ${id}`)
                    console.log(r)
                    console.groupEnd()
                }
            })
        );
    }

    collection$(queryFn?: QueryFn): Observable<T[]> {
        return this.firestore.collection<T>(`${this.basePath}`, queryFn).valueChanges().pipe(
            distinctUntilChanged(),
            tap(r => {
                if (!environment.production) {
                    console.groupCollapsed(`Firestore Streaming [${this.basePath}] [collection$]`)
                    console.table(r)
                    console.groupEnd()
                }
            })
        );
    }

    geoCollection$(center: geofirex.FirePoint, radius: number, field: string, opts?: geofirex.GeoQueryOptions): Observable<T[]> {
        console.log('return geo query...');
        return this.geoFireXService.geoFireClient.query<T>(`${this.basePath}`).within(center, radius, field, opts).pipe(
            distinctUntilChanged(),
            tap(r => {
                if (!environment.production) {
                    console.groupCollapsed(`Firestore Streaming [${this.basePath}] [geoCollection$]`)
                    console.table(r)
                    console.groupEnd()
                }
            })
        );
    }

    create(value: T) {
        const id = this.firestore.createId();
        return this.collection.doc(id).set(Object.assign({}, { id }, value)).then(_ => {
            if (!environment.production) {
                console.groupCollapsed(`Firestore Service [${this.basePath}] [create]`)
                console.log('[Id]', id, value)
                console.groupEnd()
            }
        })
    }

    update(id: string, value: T) {
        return this.collection.doc(id).update(Object.assign({}, { id }, value)).then(_ => {
            if (!environment.production) {
                console.groupCollapsed(`Firestore Service [${this.basePath}] [update]`)
                console.log('[Id]', id, value)
                console.groupEnd()
            }
        })
    }

    delete(id: string) {
        return this.collection.doc(id).delete().then(_ => {
            if (!environment.production) {
                console.groupCollapsed(`Firestore Service [${this.basePath}] [delete]`)
                console.log('[Id]', id)
                console.groupEnd()
            }
        })
    }

    private get collection() {
        return this.firestore.collection<T>(`${this.basePath}`);
    }
}