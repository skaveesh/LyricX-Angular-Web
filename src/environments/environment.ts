// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
      apiKey: 'AIzaSyAhZgt6S5n3_H4zZ66SGc-lEshw5U0l_R4',
      authDomain: 'lyricx-app.firebaseapp.com',
      databaseURL: 'https://lyricx-app.firebaseio.com',
      projectId: 'lyricx-app',
      storageBucket: 'lyricx-app.appspot.com',
      messagingSenderId: '977133508084'
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
