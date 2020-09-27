// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: 'https://devapi.ignatius.io',
//   deploymentUrl: 'arkansas-dfa-dev.herokuapp.com',
//   applicationId: 165,
// };

export const environment = {
  production: true,
  apiUrl: 'https://api.ignatius.io',
  deploymentUrl: 'doral-crf.herokuapp.com', 
  applicationId: 117,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
