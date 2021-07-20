export const environment = {
    production: true,
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
            period: 1 * 2 * 60 * 60 * 1000
        },
        deleteStation: {
            maxAttempts: 2,
            period: 1 * 2 * 60 * 60 * 1000
        },
        updateStation: {
            maxAttempts: 2,
            period: 1 * 2 * 60 * 60 * 1000
        }
    }
};
