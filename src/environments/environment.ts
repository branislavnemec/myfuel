// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: 'AIzaSyB0c5B8oTitgs6hmrkMReS9izDobHO5VDw',
        authDomain: 'myfuelmaps.firebaseapp.com',
        databaseURL: 'https://myfuelmaps.firebaseio.com',
        projectId: 'myfuelmaps',
        storageBucket: 'myfuelmaps.appspot.com',
        messagingSenderId: '506820940146',
        appId: '1:506820940146:web:2fba62814cee04648dcdeb'
    },
    activityLimits: {
        createNewStation: {
            maxAttempts: 2,
            period: 1 * 24 * 60 * 60 * 1000
        }
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
