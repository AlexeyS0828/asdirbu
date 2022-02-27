// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  /*origin: "https://asdirbu.lt:3014/api/",
  socket_url:"https://asdirbu.lt:3015",*/
  origin: "http://asdirbu.lt:3001/api/",
  socket_url:"http://asdirbu.lt:3002",
 // origin: "http://kretoss.com:3014/api/",
 // socket_url:"http://kretoss.com:3015",
  google_api_key:"AIzaSyB11rcss8c_-wM1FhZLo4W9Pgqd3tQxByU",
  paypal_client_id:"ARpEU2kH2HQEfuqktbbiXG3scbKTGYH2i19gioAFSGNITpHcsFmiocFvSSZtWoycRNBN40b0VKHiXKKj",
  stripe_publishable_key:"pk_live_QCE5jaV2kfInZXm3wjmopXCb00TvcYyyL2",
  FACEBOOK_APP_ID:'247869892966857',
  GOOGLE_CLIENT_ID:'605857674220-nj9loh641s8c5kle76oge2kus4s0h12l.apps.googleusercontent.com',
  FACEBOOK_LOGIN_OPTIONS:{
    scope: 'public_profile,email',
    return_scopes: true,
    enable_profile_selector: true
  },
  GOOGLE_LOGIN_OPTIONS:{
    scope: 'profile email',
    return_scopes: true,
    enable_profile_selector: true
  }  
/*  paypal_client_id:"ASgJb7u--_sxxMV27GreARed1U7FTA_IFSCcnn9gkNPGFNVXzB6XgkcpcGElmkw1MXqw3c8r22HtDWDi",
  stripe_publishable_key:"pk_test_rje2SYEyjpMA0YWdKpCypbZ600dX8lzuGI",*/
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
